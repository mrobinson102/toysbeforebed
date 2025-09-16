const fs = require("fs");
const path = require("path");

const baseUrl = "https://toysbeforebed.com";
const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      fileList = walk(filePath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(filePath.replace(/\\/g, "/")); // normalize Windows paths
    }
  });
  return fileList;
}

// Collect all HTML files except includes
let pages = walk(".").filter(f => !f.startsWith("includes/"));

// Build sitemap.xml
let xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

pages.forEach(p => {
  const url = p === "index.html" ? `${baseUrl}/` : `${baseUrl}/${p}`;
  xml += `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>\n`;
});

xml += "</urlset>\n";

// Build sitemap.html
let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sitemap</title>
  <link href="styles/styles.css" rel="stylesheet">
</head>
<body>
  <div id="navbar"></div>
  <main class="page">
    <h1>Sitemap</h1>
    <ul>
`;

pages.forEach(p => {
  const url = p === "index.html" ? "index.html" : p;
  html += `      <li><a href="${url}">${url}</a></li>\n`;
});

html += `    </ul>
  </main>
  <div id="footer"></div>
  <script src="scripts/include.js" defer></script>
</body>
</html>`;

// Write files
fs.writeFileSync("sitemap.xml", xml, "utf8");
fs.writeFileSync("sitemap.html", html, "utf8");

console.log("✅ sitemap.xml and sitemap.html regenerated with lastmod =", today);
