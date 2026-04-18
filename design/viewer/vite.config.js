import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

const processDir = path.resolve(__dirname, '../process');

/**
 * Vite plugin that watches design/process/*.md for changes
 * and pushes real-time updates to the browser via HMR.
 */
function markdownHotReload() {
  return {
    name: 'markdown-hot-reload',
    configureServer(server) {
      // Serve markdown files as JSON API
      server.middlewares.use('/api/chapters', (req, res, next) => {
        if (req.url === '/' || req.url === '') {
          const files = fs.readdirSync(processDir)
            .filter(f => f.endsWith('.md'))
            .sort((a, b) => {
              if (a === 'README.md') return -1;
              if (b === 'README.md') return 1;
              return a.localeCompare(b);
            });

          const chapters = files.map(filename => {
            const content = fs.readFileSync(path.join(processDir, filename), 'utf-8');
            const title = content.match(/^#\s+(.+)/m)?.[1] || filename;
            const tierMatch = content.match(/>\s+\*\*Tier\s+(\d+)/);
            const tier = tierMatch ? parseInt(tierMatch[1]) : filename === 'README.md' ? 0 : 5;

            // Parse YAML frontmatter `operation:` field — may be a string
            // ("ingest") or a list ("[ingest, lint]").
            const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
            let operations = [];
            if (frontmatter) {
              const opMatch = frontmatter[1].match(/^operation:\s*(.+)$/m);
              if (opMatch) {
                const raw = opMatch[1].trim();
                if (raw.startsWith('[')) {
                  operations = raw.slice(1, -1).split(',').map(s => s.trim()).filter(Boolean);
                } else {
                  operations = [raw];
                }
              }
            }

            return { filename, title, tier, operations };
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(chapters));
          return;
        }

        // Serve individual chapter: /api/chapters/01-discovery.md
        const filename = req.url.replace(/^\//, '').split('?')[0];
        const filepath = path.join(processDir, filename);

        if (fs.existsSync(filepath)) {
          let content = fs.readFileSync(filepath, 'utf-8');
          // Strip YAML frontmatter before sending to the browser — the
          // `operation:` field is metadata for the listing endpoint, not
          // reading content.
          content = content.replace(/^---\n[\s\S]*?\n---\n+/, '');
          res.setHeader('Content-Type', 'text/plain');
          res.end(content);
          return;
        }

        next();
      });

      // Watch for markdown file changes and notify client
      const watcher = fs.watch(processDir, { recursive: false }, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
          server.ws.send({
            type: 'custom',
            event: 'md-update',
            data: { filename, timestamp: Date.now() }
          });
        }
      });

      server.httpServer?.on('close', () => watcher.close());
    }
  };
}

export default defineConfig({
  plugins: [markdownHotReload()],
  server: {
    port: 5200,
    open: true
  }
});
