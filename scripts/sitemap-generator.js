const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const BASE_URL = 'https://toysbeforebed.com';

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'includes', 'scripts'].includes(entry.name)) {
        continue;
      }
      files = files.concat(getHtmlFiles(res));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(path.relative(rootDir, res));
    }
  }
  return files;
}

const htmlFiles = getHtmlFiles(rootDir).sort();

const listItems = htmlFiles
  .map(file => {
    const urlPath = '/' + file.replace(/\\/g, '/');
    const url = BASE_URL + urlPath;
    return `      <li><a href="${url}">${url}</a></li>`;
  })
  .join('\n');

const sitemapHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sitemap | Toys Before Bed™</title>
  <link href="styles/styles.css" rel="stylesheet">
</head>
<body id="top">
  <div id="navbar"></div>
  <main class="container">
    <h1>Sitemap</h1>
    <ul>
${listItems}
    </ul>
  </main>
  <div id="footer"></div>
  <script src="scripts/include.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(path.join(rootDir, 'sitemap.html'), sitemapHtml, 'utf-8');

const today = new Date().toISOString().split('T')[0];
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
htmlFiles.forEach(file => {
  const urlPath = '/' + file.replace(/\\/g, '/');
  const url = BASE_URL + urlPath;
  xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
});
xml += '</urlset>\n';
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');

console.log('sitemap.html and sitemap.xml generated.');
