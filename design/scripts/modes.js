/**
 * Shared configuration for the Artifact Sync Protocol.
 * Maps each design mode to its output directory, declared inputs, and downstream consumers.
 */

export const MODES = {
  discovery: {
    label: 'Discovery',
    tier: 1,
    outputDir: 'design/discovery',
    inputs: [],
    downstream: ['user-models', 'visual', 'content'],
  },
  'user-models': {
    label: 'User Models',
    tier: 1,
    outputDir: 'design/user-models',
    inputs: [
      'design/discovery/stakeholder-map.md',
      'design/discovery/qualitative-synthesis.md',
      'design/discovery/quantitative-synthesis.md',
      'design/discovery/design-brief.md',
    ],
    downstream: ['journeys', 'stories', 'content', 'visual', 'canvas'],
  },
  journeys: {
    label: 'Journey Mapping',
    tier: 2,
    outputDir: 'design/journeys',
    inputs: [
      'design/user-models/personas/',
      'design/discovery/design-brief.md',
    ],
    downstream: ['stories', 'ia', 'interaction'],
  },
  stories: {
    label: 'Story Mapping',
    tier: 2,
    outputDir: 'design/stories',
    inputs: [
      'design/journeys/',
      'design/user-models/personas/',
    ],
    downstream: ['ia', 'interaction', 'canvas'],
  },
  ia: {
    label: 'Information Architecture',
    tier: 2,
    outputDir: 'design/information-architecture',
    inputs: [
      'design/journeys/task-flows/',
      'design/stories/story-map.md',
      'design/user-models/personas/',
    ],
    downstream: ['interaction', 'content', 'canvas'],
  },
  interaction: {
    label: 'Interaction Design',
    tier: 3,
    outputDir: 'design/interaction',
    inputs: [
      'design/information-architecture/',
      'design/stories/story-map.md',
    ],
    downstream: ['content', 'accessibility', 'canvas'],
  },
  visual: {
    label: 'Visual Design',
    tier: 3,
    outputDir: 'design/visual',
    inputs: [
      'design/discovery/design-brief.md',
      'design/user-models/personas/',
      'design/information-architecture/',
    ],
    downstream: ['accessibility', 'canvas'],
  },
  content: {
    label: 'Content Strategy',
    tier: 3,
    outputDir: 'design/content',
    inputs: [
      'design/user-models/personas/',
      'design/interaction/error-strategy.md',
      'design/interaction/state-inventory.md',
      'design/discovery/domain-glossary.md',
    ],
    downstream: ['accessibility', 'canvas'],
  },
  accessibility: {
    label: 'Accessibility',
    tier: 3,
    outputDir: 'design/accessibility',
    inputs: [
      'design/visual/color-rationale.md',
      'design/interaction/interaction-model.md',
      'design/information-architecture/navigation-model.md',
    ],
    downstream: ['canvas'],
  },
  validation: {
    label: 'Design Validation',
    tier: 3,
    outputDir: 'design/validation',
    inputs: [],  // flexible — uses whatever exists
    downstream: ['canvas'],
  },
  governance: {
    label: 'Design Governance',
    tier: 3,
    outputDir: 'design/governance',
    inputs: [
      'design/visual/visual-language.md',
    ],
    downstream: [],
  },
  canvas: {
    label: 'Canvas Briefs',
    tier: 4,
    outputDir: 'design/canvas',
    inputs: [
      'design/information-architecture/sitemap.md',
      'design/interaction/interaction-model.md',
      'design/visual/visual-language.md',
      'design/content/terminology.md',
      'design/user-models/personas/',
      'design/stories/story-map.md',
      'design/interaction/state-inventory.md',
      'design/interaction/behavioral-spec.md',
      'design/interaction/error-strategy.md',
      'design/content/microcopy-patterns.md',
      'design/accessibility/aria-patterns.md',
      'design/accessibility/keyboard-nav-plan.md',
      'design/accessibility/color-contrast-audit.md',
      'design/validation/review-checklist.md',
    ],
    downstream: ['prototype'],
  },
  prototype: {
    label: 'Coded Prototype',
    tier: 4,
    outputDir: 'design/prototype',
    inputs: [
      'design/canvas/',
      'design/stories/walking-skeleton.md',
      'design/stories/story-map.md',
      'design/interaction/interaction-model.md',
      'design/interaction/behavioral-spec.md',
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
