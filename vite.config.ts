import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

/**
 * GitHub Pages SPA fallback: GitHub Pages serves 404.html for unknown
 * paths — copying index.html to 404.html makes deep links like /jobs
 * load the app instead of GitHub's error page. Harmless on other hosts.
 */
function ghPagesSpaFallback(): Plugin {
  return {
    name: 'gh-pages-spa-fallback',
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      const index = path.join(dist, 'index.html');
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, '404.html'));
      }
    },
  };
}

// https://vite.dev/config/
// VITE_BASE_PATH is set by the GitHub Actions workflow to /<repo-name>/
// so the site works on username.github.io/<repo-name>/ project pages.
// Locally and on root-domain hosting (Cloudflare/custom domain) it stays './'.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  plugins: [inspectAttr(), react(), ghPagesSpaFallback()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
