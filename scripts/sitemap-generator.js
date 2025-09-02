const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const footerPath = path.join(rootDir, 'includes', 'footer.html');
const footerHtml = fs.readFileSync(footerPath, 'utf-8');

// Extract links that start with '/'
const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
const links = [];
let match;
while ((match = linkRegex.exec(footerHtml))) {
  const href = match[1];
  const text = match[2];
  if (href.startsWith('/')) {
    links.push({ href, text });
  }
}

// Generate sitemap.html
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
${links.map(l => `      <li><a href="${l.href}">${l.text}</a></li>`).join('\n')}
    </ul>
  </main>
  <div id="footer"></div>
  <script src="scripts/include.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(path.join(rootDir, 'sitemap.html'), sitemapHtml, 'utf-8');

// Generate sitemap.xml with today's date for all pages
const BASE_URL = 'https://toysbeforebed.com';
const today = new Date().toISOString().split('T')[0];
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
links.forEach(link => {
  xml += `  <url>\n    <loc>${BASE_URL}${link.href}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
});
xml += '</urlset>\n';
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');

console.log('sitemap.html and sitemap.xml generated.');
