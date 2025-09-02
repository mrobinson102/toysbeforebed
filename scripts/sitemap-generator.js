const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

// Read footer links
const footerHtml = fs.readFileSync(path.join(rootDir, 'includes', 'footer.html'), 'utf-8');
const footerLinks = [];
const linkRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;
let match;
while ((match = linkRegex.exec(footerHtml)) !== null) {
  footerLinks.push({ href: match[1], text: match[2] });
}

const coreNames = ['Home', 'About', 'Join Us', 'FAQ', 'Contact'];
const policyNames = ['Privacy (US)', 'Privacy (UK)', 'Terms', 'Returns', '2257 Compliance'];
const core = [];
const policies = [];
footerLinks.forEach(link => {
  if (coreNames.includes(link.text)) {
    core.push(link);
  } else if (policyNames.includes(link.text)) {
    policies.push(link);
  }
});

function titleize(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Guides
const guides = [{ href: '/bedside.html', text: 'Bedside Reading' }];
const guidesDir = path.join(rootDir, 'bedside');
if (fs.existsSync(guidesDir)) {
  fs.readdirSync(guidesDir).filter(f => f.endsWith('.html')).forEach(f => {
    guides.push({ href: `/bedside/${f}`, text: titleize(f.replace('.html', '')) });
  });
}

// Blog
const blog = [{ href: '/blog.html', text: 'Blog Index' }];
const blogDir = path.join(rootDir, 'blog');
if (fs.existsSync(blogDir)) {
  fs.readdirSync(blogDir).filter(f => f.endsWith('.html')).forEach(f => {
    blog.push({ href: `/blog/${f}`, text: titleize(f.replace('.html', '')) });
  });
}

const groups = [
  { title: 'Core Pages', links: core },
  { title: 'Policies', links: policies },
  { title: 'Guides', links: guides },
  { title: 'Blog', links: blog }
];

function renderSection(group) {
  return `    <section>\n      <h2>${group.title}</h2>\n      <ul>\n${group.links.map(l => `        <li><a href="${l.href}">${l.text}</a></li>`).join('\n')}\n      </ul>\n    </section>`;
}

// Generate sitemap.html
const sitemapHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Sitemap | Toys Before Bed™</title>\n  <link href="styles/styles.css" rel="stylesheet">\n  <style>\n    section {margin-bottom: 2rem;}\n    ul {list-style: none; padding-left: 0;}\n    li {margin-bottom: .5rem;}\n    a:hover {text-decoration: underline;}\n  </style>\n</head>\n<body id="top">\n  <div id="navbar"></div>\n  <main class="container">\n    <h1>Sitemap</h1>\n${groups.map(renderSection).join('\n')}\n  </main>\n  <div id="footer"></div>\n  <script src="scripts/include.js" defer></script>\n</body>\n</html>\n`;
fs.writeFileSync(path.join(rootDir, 'sitemap.html'), sitemapHtml, 'utf-8');

// Generate sitemap.xml
const allLinks = groups.flatMap(g => g.links);
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
allLinks.forEach(link => {
  xml += `  <url>\n    <loc>https://toysbeforebed.com${link.href}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`;
});
xml += '</urlset>\n';
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), xml, 'utf-8');

console.log('sitemap.html and sitemap.xml generated.');
