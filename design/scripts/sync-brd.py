#!/usr/bin/env python3
"""
BRD Validation Script
Validates bidirectional consistency between design/BRD.xlsx and design artifacts:
  - story-map.md (DS-NNN IDs)
  - business-rules-register.md (BR-NN IDs)
  - screen-inventory.md (story-to-screen mapping)
  - release-slices.md (story IDs)
  - BRD_manifest.md (artifact version freshness)

Usage:
    python design/scripts/sync-brd.py [project_root]

Exit code 1 if errors found, 0 otherwise.
"""

import os
import re
import sys

try:
    from openpyxl import load_workbook
except ImportError:
    print("ERROR: openpyxl is required. Install with: pip install openpyxl")
    sys.exit(1)


def resolve_root(argv):
    """Resolve project root from CLI arg or default to ../../ relative to script."""
    if len(argv) > 1:
        return os.path.abspath(argv[1])
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(script_dir, '..', '..'))


def read_file(path):
    """Read a file and return its contents, or None if missing."""
    if not os.path.isfile(path):
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def extract_ids(text, pattern):
    """Extract all unique IDs matching a regex pattern from text."""
    if text is None:
        return set()
    return set(re.findall(pattern, text))


def read_brd(brd_path):
    """
    Read the BRD User Stories sheet.
    Returns (story_ids, ac_text_by_row, feature_by_row) where:
      - story_ids: set of DS-NNN from column D
      - ac_text_by_row: dict {row: acceptance_criteria_text} from column F
      - feature_by_row: dict {row: feature_value} from column C
    Data rows start at row 4 (row 3 is headers).
    """
    if not os.path.isfile(brd_path):
        return None, None, None

    wb = load_workbook(brd_path, data_only=True)

    # Find the User Stories sheet (case-insensitive partial match)
    sheet = None
    for name in wb.sheetnames:
        if 'user stor' in name.lower():
            sheet = wb[name]
            break

    if sheet is None:
        return None, None, None

    story_ids = set()
    ac_text_by_row = {}
    feature_by_row = {}

    for row_num in range(4, sheet.max_row + 1):
        # Column D = story ID
        cell_d = sheet.cell(row=row_num, column=4).value
        if cell_d:
            ids = re.findall(r'DS-\d+', str(cell_d))
            story_ids.update(ids)

        # Column F = acceptance criteria
        cell_f = sheet.cell(row=row_num, column=6).value
        if cell_f:
            ac_text_by_row[row_num] = str(cell_f)

        # Column C = feature/touchpoint
        cell_c = sheet.cell(row=row_num, column=3).value
        feature_by_row[row_num] = cell_c

    wb.close()
    return story_ids, ac_text_by_row, feature_by_row


def check_story_map_to_brd(story_map_ids, brd_ids):
    """Check 1: Every DS-NNN in story-map.md exists in BRD col D."""
    missing = sorted(story_map_ids - brd_ids, key=lambda x: int(x.split('-')[1]))
    return missing


def check_brd_to_story_map(brd_ids, story_map_ids):
    """Check 2: Every DS-NNN in BRD col D exists in story-map.md."""
    missing = sorted(brd_ids - story_map_ids, key=lambda x: int(x.split('-')[1]))
    return missing


def check_br_ids_in_brd(ac_text_by_row, br_ids):
    """Check 3: Every BR-NN in BRD col F exists in business-rules-register.md."""
    brd_br_ids = set()
    for text in ac_text_by_row.values():
        brd_br_ids.update(re.findall(r'BR-\d+', text))

    missing = sorted(brd_br_ids - br_ids, key=lambda x: int(x.split('-')[1]))
    return missing, brd_br_ids


def check_feature_coverage(brd_ids, feature_by_row, brd_path):
    """Check 4: Warn if a story has no Feature/Touchpoint value in col C."""
    if not os.path.isfile(brd_path):
        return []

    wb = load_workbook(brd_path, data_only=True)
    sheet = None
    for name in wb.sheetnames:
        if 'user stor' in name.lower():
            sheet = wb[name]
            break

    if sheet is None:
        wb.close()
        return []

    warnings = []
    for row_num in range(4, sheet.max_row + 1):
        cell_d = sheet.cell(row=row_num, column=4).value
        cell_c = sheet.cell(row=row_num, column=3).value
        if cell_d and re.search(r'DS-\d+', str(cell_d)):
            if not cell_c or str(cell_c).strip() == '':
                ids = re.findall(r'DS-\d+', str(cell_d))
                for sid in ids:
                    warnings.append(f"{sid} (row {row_num}) has no Feature/Touchpoint value")

    wb.close()
    return warnings


def check_manifest_freshness(manifest_path):
    """Check 5: Read BRD_manifest.md and warn if any mode shows '—' (never contributed)."""
    content = read_file(manifest_path)
    if content is None:
        return None, []

    warnings = []
    for line in content.splitlines():
        line = line.strip()
        if line.startswith('|') and not line.startswith('|---') and not line.startswith('| Mode'):
            cols = [c.strip() for c in line.split('|')]
            # cols: ['', mode, last_contributed, artifact_version, stories_touched, '']
            if len(cols) >= 5:
                mode = cols[1]
                last_contributed = cols[2]
                if last_contributed == '—' or last_contributed == '':
                    warnings.append(f"Mode '{mode}' has never contributed to BRD")

    return content, warnings


def check_release_slices_to_brd(release_ids, brd_ids):
    """Check 6: Every DS-NNN in release-slices.md exists in BRD col D."""
    missing = sorted(release_ids - brd_ids, key=lambda x: int(x.split('-')[1]))
    return missing


def main():
    root = resolve_root(sys.argv)

    brd_path = os.path.join(root, 'design', 'BRD.xlsx')
    story_map_path = os.path.join(root, 'design', '05_STORIES', 'story-map.md')
    br_register_path = os.path.join(root, 'design', '04_PROCESS_FLOWS', 'business-rules-register.md')
    screen_inv_path = os.path.join(root, 'design', '06_INFORMATION_ARCHITECTURE', 'screen-inventory.md')
    release_slices_path = os.path.join(root, 'design', '05_STORIES', 'release-slices.md')
    manifest_path = os.path.join(root, 'design', 'BRD_manifest.md')

    errors = 0
    warnings = 0

    print("=== BRD Validation Report ===\n")

    # ---- Load BRD ----
    brd_ids, ac_text_by_row, feature_by_row = read_brd(brd_path)
    if brd_ids is None:
        print(f"WARNING: BRD not found at {brd_path} — skipping all BRD checks\n")
        print("=== Summary: 0 errors, 1 warning ===")
        sys.exit(0)

    # ---- Load story map ----
    story_map_text = read_file(story_map_path)
    story_map_ids = extract_ids(story_map_text, r'DS-\d+')

    # ---- Load business rules register ----
    br_text = read_file(br_register_path)
    br_ids = extract_ids(br_text, r'BR-\d+')

    # ---- Load release slices ----
    release_text = read_file(release_slices_path)
    release_ids = extract_ids(release_text, r'DS-\d+')

    # ---- Check 1: Story Map → BRD ----
    print("--- 1. Story Map → BRD ---")
    if story_map_text is None:
        print(f"WARNING: story-map.md not found at {story_map_path} — skipping\n")
        warnings += 1
    else:
        missing = check_story_map_to_brd(story_map_ids, brd_ids)
        if not missing:
            print(f"✓ All {len(story_map_ids)} stories in story-map.md exist in BRD\n")
        else:
            for sid in missing:
                print(f"✗ {sid} not found in BRD")
                errors += 1
            print()

    # ---- Check 2: BRD → Story Map ----
    print("--- 2. BRD → Story Map ---")
    if story_map_text is None:
        print(f"WARNING: story-map.md not found — skipping\n")
        warnings += 1
    else:
        missing = check_brd_to_story_map(brd_ids, story_map_ids)
        if not missing:
            print(f"✓ All {len(brd_ids)} stories in BRD exist in story-map.md\n")
        else:
            for sid in missing:
                print(f"✗ {sid} in BRD not found in story-map.md")
                errors += 1
            print()

    # ---- Check 3: BR-NN in BRD AC → business-rules-register ----
    print("--- 3. BRD Acceptance Criteria BR Tags → Business Rules Register ---")
    if br_text is None:
        print(f"WARNING: business-rules-register.md not found at {br_register_path} — skipping\n")
        warnings += 1
    elif ac_text_by_row is None:
        print("WARNING: No acceptance criteria data in BRD — skipping\n")
        warnings += 1
    else:
        missing, brd_br_ids = check_br_ids_in_brd(ac_text_by_row, br_ids)
        if not brd_br_ids:
            print("✓ No BR-NN tags found in BRD acceptance criteria (none to validate)\n")
        elif not missing:
            print(f"✓ All {len(brd_br_ids)} BR tags in BRD exist in business-rules-register.md\n")
        else:
            for bid in missing:
                print(f"✗ {bid} in BRD acceptance criteria not found in business-rules-register.md")
                errors += 1
            print()

    # ---- Check 4: Feature/Touchpoint coverage ----
    print("--- 4. Feature/Touchpoint Coverage ---")
    feat_warnings = check_feature_coverage(brd_ids, feature_by_row, brd_path)
    if not feat_warnings:
        print(f"✓ All stories in BRD have a Feature/Touchpoint value\n")
    else:
        for w in feat_warnings:
            print(f"⚠ {w}")
            warnings += 1
        print()

    # ---- Check 5: Manifest freshness ----
    print("--- 5. Manifest Freshness ---")
    manifest_content, manifest_warnings = check_manifest_freshness(manifest_path)
    if manifest_content is None:
        print(f"WARNING: BRD_manifest.md not found at {manifest_path} — skipping\n")
        warnings += 1
    elif not manifest_warnings:
        print("✓ All modes have contributed to BRD\n")
    else:
        for w in manifest_warnings:
            print(f"⚠ {w}")
            warnings += 1
        print()

    # ---- Check 6: Release Slices → BRD ----
    print("--- 6. Release Slices → BRD ---")
    if release_text is None:
        print(f"WARNING: release-slices.md not found at {release_slices_path} — skipping\n")
        warnings += 1
    else:
        missing = check_release_slices_to_brd(release_ids, brd_ids)
        if not release_ids:
            print("✓ No DS-NNN IDs found in release-slices.md (none to validate)\n")
        elif not missing:
            print(f"✓ All {len(release_ids)} stories in release-slices.md exist in BRD\n")
        else:
            for sid in missing:
                print(f"✗ {sid} in release-slices.md not found in BRD")
                errors += 1
            print()

    # ---- Summary ----
    print(f"=== Summary: {errors} errors, {warnings} warnings ===")
    sys.exit(1 if errors > 0 else 0)


if __name__ == '__main__':
    main()
