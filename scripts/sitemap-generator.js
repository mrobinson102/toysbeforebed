const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const domain = 'https://toysbeforebed.com';

const topLevelPages = [
  'index.html',
  'about.html',
  'join.html',
  'faq.html',
  'contact.html',
  'privacy.html',
  'privacy-uk.html',
  'terms.html',
  'returns.html',
  '2257.html',
  'sitemap.html',
  'thank-you.html'
];

const contentDirs = ['bedside', 'blog', 'products'];

function getAllHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'includes', 'scripts'].includes(entry.name)) {
        continue;
      }
      files = files.concat(getAllHtmlFiles(res));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.relative(rootDir, res).replace(/\\/g, '/'));
    }
  }
  return files;
}

function isAllowed(relPath) {
  if (topLevelPages.includes(relPath)) return true;
  return contentDirs.some(dir => relPath.startsWith(`${dir}/`));
}

function getTitle(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/<title>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
  } catch {
    return null;
  }
}

function getLastMod(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

const htmlFiles = getAllHtmlFiles(rootDir).filter(isAllowed).sort();

const pages = htmlFiles.map(rel => {
  const full = path.join(rootDir, rel);
  const title = getTitle(full) || path.basename(rel);
  let lastmod = getLastMod(full);
  if (rel === 'sitemap.html') {
    lastmod = new Date().toISOString().split('T')[0];
  }
  return { rel, title, lastmod };
});

const listItems = pages
  .map(p => `      <li><a href="/${p.rel}">${p.title}</a></li>`)
  .join('\n');

const sitemapHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap | Toys Before Bed™</title>
  <link rel="stylesheet" href="/styles/styles.css">
  <style>
    ul.sitemap-list { list-style: none; padding-left: 0; }
    ul.sitemap-list a { color: #7c0e0c; text-decoration: none; }
    ul.sitemap-list a:hover { color: #ffd9a0; }
  </style>
</head>
<body id="top">
  <div id="navbar"></div>
  <main class="container">
    <h1>Sitemap</h1>
    <ul class="sitemap-list">
${listItems}
    </ul>
  </main>
  <div id="footer"></div>
  <script src="/scripts/include.js" defer></script>
</body>
</html>\n`;

fs.writeFileSync(path.join(rootDir, 'sitemap.html'), sitemapHtml, 'utf8');

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
pages.forEach(p => {
  xml += `  <url>\n    <loc>${domain}/${p.rel}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n  </url>\n`;
});
xml += '</urlset>\n';

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf8');

console.log('sitemap.html and sitemap.xml generated');

