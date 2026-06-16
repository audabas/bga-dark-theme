#!/usr/bin/env node
// Guards against BGA's custom-CSS size limit.
// BGA's Preferences -> Advanced custom-CSS box silently rejects/truncates CSS
// above a server-side limit (~65535 bytes, the MySQL TEXT column max).
// dist/style.css is what users paste in, so it must stay under that limit.
const fs = require("fs");
const path = require("path");

// Hard limit enforced by BGA (bytes). Going over this breaks the theme.
const HARD_LIMIT = 65535;
// Warn when we get close, so we notice before running out of headroom.
const WARN_LIMIT = 62000;

const cssPath = path.join(__dirname, "..", "dist", "style.css");
const bytes = fs.statSync(cssPath).size;
const pct = ((bytes / HARD_LIMIT) * 100).toFixed(1);

if (bytes > HARD_LIMIT) {
  console.error(
    `❌ dist/style.css is ${bytes} bytes, over BGA's ${HARD_LIMIT}-byte limit ` +
      `(${pct}%). BGA will reject or truncate it. Reduce the CSS before releasing.`
  );
  process.exit(1);
}

if (bytes > WARN_LIMIT) {
  console.warn(
    `⚠️  dist/style.css is ${bytes} bytes (${pct}% of the ${HARD_LIMIT}-byte limit). ` +
      `Headroom is getting tight — keep new rules lean.`
  );
} else {
  console.log(`✓ dist/style.css is ${bytes} bytes (${pct}% of the ${HARD_LIMIT}-byte limit).`);
}
