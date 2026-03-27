/**
 * Shared configuration for the Artifact Sync Protocol.
 * Maps each design mode to its output directory, declared inputs, and downstream consumers.
 */

export const MODES = {
  discovery: {
    label: 'Discovery',
    tier: 1,
    outputDir: 'design/01_DISCOVERY',
    inputs: [],
    downstream: ['user-models', 'visual', 'content'],
  },
  'user-models': {
    label: 'User Models',
    tier: 1,
    outputDir: 'design/02_USER_MODELS',
    inputs: [
      'design/01_DISCOVERY/stakeholder-map.md',
      'design/01_DISCOVERY/qualitative-synthesis.md',
      'design/01_DISCOVERY/quantitative-synthesis.md',
      'design/01_DISCOVERY/design-brief.md',
      'design/01_DISCOVERY/value-framework.md',
    ],
    downstream: ['journeys', 'stories', 'content', 'visual', 'canvas'],
  },
  journeys: {
    label: 'Journey Mapping',
    tier: 2,
    outputDir: 'design/03_JOURNEYS',
    inputs: [
      'design/02_USER_MODELS/personas/',
      'design/01_DISCOVERY/design-brief.md',
      'design/01_DISCOVERY/value-framework.md',
    ],
    downstream: ['process-flows', 'stories', 'ia', 'interaction'],
  },
  'process-flows': {
    label: 'Process Flows',
    tier: 2,
    outputDir: 'design/04_PROCESS_FLOWS',
    inputs: [
      'design/03_JOURNEYS/',
      'design/02_USER_MODELS/jtbd.md',
      'design/01_DISCOVERY/domain-glossary.md',
      'design/01_DISCOVERY/design-brief.md',
      'design/01_DISCOVERY/value-framework.md',
    ],
    downstream: ['stories', 'ia', 'interaction', 'content', 'canvas', 'design/BRD.xlsx'],
  },
  stories: {
    label: 'Story Mapping',
    tier: 2,
    outputDir: 'design/05_STORIES',
    inputs: [
      'design/03_JOURNEYS/',
      'design/04_PROCESS_FLOWS/',
      'design/02_USER_MODELS/personas/',
    ],
    downstream: ['ia', 'interaction', 'canvas', 'design/BRD.xlsx'],
  },
  ia: {
    label: 'Information Architecture',
    tier: 2,
    outputDir: 'design/06_INFORMATION_ARCHITECTURE',
    inputs: [
      'design/03_JOURNEYS/task-flows/',
      'design/04_PROCESS_FLOWS/',
      'design/05_STORIES/story-map.md',
      'design/02_USER_MODELS/personas/',
    ],
    downstream: ['interaction', 'content', 'canvas', 'design/BRD.xlsx'],
  },
  interaction: {
    label: 'Interaction Design',
    tier: 3,
    outputDir: 'design/07_INTERACTION',
    inputs: [
      'design/06_INFORMATION_ARCHITECTURE/',
      'design/04_PROCESS_FLOWS/',
      'design/05_STORIES/story-map.md',
    ],
    downstream: ['content', 'accessibility', 'canvas', 'design/BRD.xlsx'],
  },
  visual: {
    label: 'Visual Design',
    tier: 3,
    outputDir: 'design/08_VISUAL',
    inputs: [
      'design/01_DISCOVERY/design-brief.md',
      'design/01_DISCOVERY/value-framework.md',
      'design/02_USER_MODELS/personas/',
      'design/06_INFORMATION_ARCHITECTURE/',
    ],
    downstream: ['accessibility', 'canvas'],
  },
  content: {
    label: 'Content Strategy',
    tier: 3,
    outputDir: 'design/09_CONTENT',
    inputs: [
      'design/02_USER_MODELS/personas/',
      'design/07_INTERACTION/error-strategy.md',
      'design/07_INTERACTION/state-inventory.md',
      'design/01_DISCOVERY/domain-glossary.md',
    ],
    downstream: ['accessibility', 'canvas', 'design/BRD.xlsx'],
  },
  accessibility: {
    label: 'Accessibility',
    tier: 3,
    outputDir: 'design/10_ACCESSIBILITY',
    inputs: [
      'design/08_VISUAL/color-rationale.md',
      'design/07_INTERACTION/interaction-model.md',
      'design/06_INFORMATION_ARCHITECTURE/navigation-model.md',
    ],
    downstream: ['canvas'],
  },
  validation: {
    label: 'Design Validation',
    tier: 3,
    outputDir: 'design/11_VALIDATION',
    inputs: [],  // flexible — uses whatever exists
    downstream: ['canvas'],
  },
  governance: {
    label: 'Design Governance',
    tier: 3,
    outputDir: 'design/12_GOVERNANCE',
    inputs: [
      'design/08_VISUAL/visual-language.md',
    ],
    downstream: [],
  },
  canvas: {
    label: 'Canvas Briefs',
    tier: 4,
    outputDir: 'design/13_CANVAS',
    inputs: [
      'design/06_INFORMATION_ARCHITECTURE/screen-inventory.md',
      'design/04_PROCESS_FLOWS/index.md',
      'design/04_PROCESS_FLOWS/business-rules-register.md',
      'design/07_INTERACTION/interaction-model.md',
      'design/07_INTERACTION/index.md',
      'design/08_VISUAL/visual-language.md',
      'design/09_CONTENT/terminology.md',
      'design/02_USER_MODELS/personas/',
      'design/05_STORIES/story-map.md',
      'design/07_INTERACTION/state-inventory.md',
      'design/07_INTERACTION/behavioral-spec.md',
      'design/07_INTERACTION/error-strategy.md',
      'design/09_CONTENT/microcopy-patterns.md',
      'design/10_ACCESSIBILITY/aria-patterns.md',
      'design/10_ACCESSIBILITY/keyboard-nav-plan.md',
      'design/10_ACCESSIBILITY/color-contrast-audit.md',
      'design/11_VALIDATION/review-checklist.md',
    ],
    downstream: ['prototype', 'design/BRD.xlsx'],
  },
  prototype: {
    label: 'Coded Prototype',
    tier: 4,
    outputDir: 'design/15_PROTOTYPE',
    inputs: [
      'design/13_CANVAS/',
      'design/05_STORIES/walking-skeleton.md',
      'design/05_STORIES/story-map.md',
      'design/07_INTERACTION/interaction-model.md',
      'design/07_INTERACTION/behavioral-spec.md',
    ],
    downstream: [],
  },
};

export const TIER_LABELS = {
  1: 'Discovery',
  2: 'Definition',
  3: 'Design',
  4: 'Develop',
};

/**
 * Parse an artifact version header from a line of text.
 * Returns { path, version, mode, updated, evidence } or null.
 */
export function parseVersionHeader(line) {
  if (!line || !line.startsWith('<!-- artifact:')) return null;
  const match = line.match(
    /<!-- artifact:\s*(.+?)\s*\|\s*version:\s*(\d+)\s*\|\s*mode:\s*(.+?)\s*\|\s*updated:\s*(.+?)(?:\s*\|\s*evidence:\s*(.+?))?\s*-->/
  );
  if (!match) return null;
  return {
    path: match[1],
    version: parseInt(match[2]),
    mode: match[3],
    updated: match[4],
    evidence: match[5] || null,
  };
}

/**
 * Build a version header string.
 */
export function buildVersionHeader({ path, version, mode, updated, evidence }) {
  let header = `<!-- artifact: ${path} | version: ${version} | mode: ${mode} | updated: ${updated}`;
  if (evidence) header += ` | evidence: ${evidence}`;
  header += ' -->';
  return header;
}
