import { marked } from 'marked';

// Configure marked for beautiful rendering
marked.setOptions({
  gfm: true,
  breaks: false,
});

// Custom renderer for enhanced typography
const renderer = new marked.Renderer();

// Add anchor links to headings
renderer.heading = function ({ text, depth }) {
  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
  const levelClass = `heading-${depth}`;
  return `<h${depth} id="${id}" class="${levelClass}">
    <a href="#${id}" class="heading-anchor" aria-hidden="true">#</a>
    ${text}
  </h${depth}>`;
};

// Style tables
renderer.table = function ({ header, body }) {
  return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
};

// Style blockquotes as callouts
renderer.blockquote = function ({ text }) {
  const isCallout = text.includes('<strong>') && text.includes('Tier');
  const className = isCallout ? 'callout callout-tier' : 'callout';
  return `<blockquote class="${className}">${text}</blockquote>`;
};

// Style code blocks
renderer.code = function ({ text, lang }) {
  return `<div class="code-block"><pre><code class="language-${lang || 'text'}">${text}</code></pre></div>`;
};

marked.use({ renderer });

// ─── State ────────────────────────────────────────────────────

let chapters = [];
let activeChapter = null;
let scrollPositions = {};

const TIER_META = {
  0: { label: 'Overview', color: '#6B7280' },
  1: { label: 'Tier 1 — Discovery', color: '#D97706' },
  2: { label: 'Tier 2 — Definition', color: '#2563EB' },
  3: { label: 'Tier 3 — Design', color: '#7C3AED' },
  4: { label: 'Tier 4 — Synthesis', color: '#059669' },
  5: { label: 'Figma Execution', color: '#DC2626' },
};

// ─── Chapter loading ──────────────────────────────────────────

async function loadChapterList() {
  const res = await fetch('/api/chapters/');
  chapters = await res.json();
  renderNav();
}

async function loadChapter(filename) {
  // Save scroll position of current chapter
  if (activeChapter) {
    scrollPositions[activeChapter] = document.getElementById('content').scrollTop;
  }

  activeChapter = filename;
  updateActiveNav();

  const res = await fetch(`/api/chapters/${filename}`);
  const markdown = await res.text();
  renderArticle(markdown, filename);

  // Restore scroll position if returning to a chapter
  const content = document.getElementById('content');
  if (scrollPositions[filename]) {
    requestAnimationFrame(() => {
      content.scrollTop = scrollPositions[filename];
    });
  } else {
    content.scrollTop = 0;
  }

  // Update URL hash
  history.replaceState(null, '', `#${filename}`);
}

// ─── Rendering ────────────────────────────────────────────────

function renderNav() {
  const nav = document.getElementById('nav');
  let currentTier = -1;

  let html = '';

  for (const chapter of chapters) {
    if (chapter.tier !== currentTier) {
      if (currentTier !== -1) html += '</div>';
      currentTier = chapter.tier;
      const meta = TIER_META[currentTier] || TIER_META[5];
      html += `<div class="nav-group">
        <div class="nav-group-label" style="--tier-color: ${meta.color}">
          <span class="tier-dot" style="background: ${meta.color}"></span>
          ${meta.label}
        </div>`;
    }

    const isReadme = chapter.filename === 'README.md';
    const label = isReadme
      ? 'Overview'
      : chapter.title
          .replace(/^Chapter \d+:\s*/, '')
          .replace(/^Design-to-Canvas\s*/, 'Canvas ')
          .replace(/^Design System\s*/, '')
          .replace(/^Design\s*/, '');

    const number = chapter.filename.match(/^(\d+)/)?.[1] || '';

    html += `<button
      class="nav-item ${activeChapter === chapter.filename ? 'active' : ''}"
      data-filename="${chapter.filename}"
      onclick="window.loadChapter('${chapter.filename}')">
      ${number ? `<span class="nav-number">${number}</span>` : ''}
      <span class="nav-label">${label}</span>
    </button>`;
  }

  html += '</div>';
  nav.innerHTML = html;
}

function updateActiveNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.filename === activeChapter);
  });
}

function renderArticle(markdown, filename) {
  const article = document.getElementById('article');
  const chapter = chapters.find(c => c.filename === filename);
  const meta = TIER_META[chapter?.tier ?? 0] || TIER_META[0];

  const html = marked.parse(markdown);

  // Extract reading time (roughly 200 wpm)
  const wordCount = markdown.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  article.innerHTML = `
    <div class="article-meta">
      <span class="article-tier" style="--tier-color: ${meta.color}">
        <span class="tier-dot" style="background: ${meta.color}"></span>
        ${meta.label}
      </span>
      <span class="article-reading-time">${readingTime} min read</span>
      <span class="article-filename">${filename}</span>
    </div>
    <div class="article-body">${html}</div>
  `;

  // Build table of contents from h2s
  buildTOC(article);
}

function buildTOC(article) {
  const headings = article.querySelectorAll('.article-body h2');
  if (headings.length < 3) return;

  const toc = document.createElement('nav');
  toc.className = 'toc';
  toc.innerHTML = '<div class="toc-title">In this chapter</div>';

  const list = document.createElement('ul');
  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent.replace('#', '').trim();
    a.addEventListener('click', (e) => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.appendChild(list);
  article.querySelector('.article-meta')?.after(toc);
}

// ─── Real-time sync via Vite HMR ──────────────────────────────

if (import.meta.hot) {
  import.meta.hot.on('md-update', async (data) => {
    const { filename } = data;

    // Flash the sync indicator
    const indicator = document.getElementById('sync-indicator');
    indicator.classList.add('syncing');
    setTimeout(() => indicator.classList.remove('syncing'), 1500);

    // Show toast
    showToast(`Updated: ${filename}`);

    // If the changed file is the one currently being viewed, re-render it
    if (filename === activeChapter) {
      const res = await fetch(`/api/chapters/${filename}?t=${data.timestamp}`);
      const markdown = await res.text();

      // Preserve scroll position during re-render
      const content = document.getElementById('content');
      const scrollTop = content.scrollTop;
      renderArticle(markdown, filename);
      content.scrollTop = scrollTop;
    }

    // If README changed or a file was added/removed, reload the nav
    if (filename === 'README.md') {
      await loadChapterList();
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ─── Keyboard navigation ──────────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (!activeChapter) return;

  const currentIndex = chapters.findIndex(c => c.filename === activeChapter);
  if (currentIndex === -1) return;

  if (e.key === 'ArrowLeft' || (e.key === 'k' && e.metaKey)) {
    e.preventDefault();
    if (currentIndex > 0) loadChapter(chapters[currentIndex - 1].filename);
  }
  if (e.key === 'ArrowRight' || (e.key === 'j' && e.metaKey)) {
    e.preventDefault();
    if (currentIndex < chapters.length - 1) loadChapter(chapters[currentIndex + 1].filename);
  }
});

// ─── Init ─────────────────────────────────────────────────────

// Expose for onclick handlers
window.loadChapter = loadChapter;

await loadChapterList();

// Load chapter from URL hash or default to README
const hash = location.hash.replace('#', '');
const initial = chapters.find(c => c.filename === hash) ? hash : 'README.md';
loadChapter(initial);
