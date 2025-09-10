const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'includes', 'scripts'].includes(entry.name)) {
      continue;
    }
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(res);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(res);
    }
  }
}

walk(rootDir);

const reportLines = [];
const brokenLinks = [];

for (const file of htmlFiles) {
  const relPath = path.relative(rootDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const missing = [];

  if (!content.includes('<div id="navbar"></div>')) missing.push('navbar placeholder');
  if (!content.includes('<div id="footer"></div>')) missing.push('footer placeholder');
  if (!content.match(/<script src="(\.\.\/)?scripts\/include.js" defer><\/script>/)) {
    missing.push('include.js script');
  }
  if (!content.includes('styles/styles.css')) missing.push('styles.css link');

  const linkRegex = /<a\s+[^>]*href="([^"#]+)"/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue;
    }
    let target;
    if (href.startsWith('/')) {
      target = path.join(rootDir, href.slice(1));
    } else {
      target = path.resolve(path.dirname(file), href);
    }
    if (!fs.existsSync(target)) {
      brokenLinks.push(`${relPath} -> ${href}`);
    }
  }

  if (missing.length === 0) {
    reportLines.push(`${relPath}: OK`);
  } else {
    reportLines.push(`${relPath}: missing ${missing.join(', ')}`);
  }
}

fs.writeFileSync(path.join(rootDir, 'verify-report.txt'), reportLines.join('\n') + '\n');
fs.writeFileSync(path.join(rootDir, 'broken-links.txt'), brokenLinks.join('\n') + '\n');

if (brokenLinks.length || reportLines.some(line => !line.endsWith('OK'))) {
  console.log('Verification completed with issues. See verify-report.txt and broken-links.txt');
} else {
  console.log('Verification completed successfully.');
}

process.exit(0);
