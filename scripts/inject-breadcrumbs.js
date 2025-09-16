const fs = require("fs");
const path = require("path");

const siteUrl = "https://toysbeforebed.com";

// Collect all .html files recursively
function walk(dir, fileList = []) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(filePath.replace(/\\/g, "/"));
    }
  });
  return fileList;
}

// Generate XML sitemap
function generateXML(urls) {
  const lastmod = new Date().toISOString().split("T")[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}/${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

// Group URLs for HTML sitemap
function groupUrls(urls) {
  return {
    Pages: urls.filter(
      (u) =>
        [
          "index.html",
          "about.html",
          "contact.html",
          "join.html",
          "faq.html",
        ].includes(u)
    ),
    Blog: urls.filter((u) => u.startsWith("blog")),
    Products: urls.filter((u) => u.startsWith("products")),
    Legal: urls.filter((u) =>
      ["privacy.html", "privacy-uk.html", "terms.html", "returns.html", "2257.html"].includes(u)
    ),
    Other: urls.filter(
      (u) =>
        !(
          u.startsWith("blog") ||
          u.startsWith("products") ||
          [
            "index.html",
            "about.html",
            "contact.html",
            "join.html",
            "faq.html",
            "privacy.html",
            "privacy-uk.html",
            "terms.html",
            "returns.html",
            "2257.html",
          ].includes(u)
        )
    ),
  };
}

// Generate HTML sitemap
function generateHTML(grouped) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sitemap - Toys Before Bed™</title>
  <link href="styles/styles.css" rel="stylesheet">
</head>
<body>
  <div id="navbar"></div>
  <main class="container">
    <h1>Sitemap</h1>
    ${Object.entries(grouped)
      .map(
        ([section, links]) =>
          links.length > 0
            ? `<h2>${section}</h2>
        <table class="sitemap-table">
          <tbody>
            ${links
              .map(
                (url) => `<tr><td><a href="${url}">${url.replace(".html", "")}</a></td></tr>`
              )
              .join("\n")}
          </tbody>
        </table>`
            : ""
      )
      .join("\n")}
  </main>
  <div id="footer"></div>
  <script src="scripts/include.js" defer></script>
  <style>
    .sitemap-table { width: 100%; border-collapse: collapse; margin-bottom: 2rem; }
    .sitemap-table td { padding: 0.5rem; border-bottom: 1px solid #ddd; }
    .sitemap-table a { color: #7c0e0c; text-decoration: none; }
    .sitemap-table a:hover { text-decoration: underline; }
  </style>
</body>
</html>`;
}

// Main
const files = walk(".").filter(
  (f) =>
    !f.startsWith("includes/") &&
    !f.startsWith("node_modules/") &&
    !f.includes("sitemap")
);

const urls = files.map((f) => f.replace("./", ""));
const xml = generateXML(urls);
fs.writeFileSync("sitemap.xml", xml, "utf8");

const grouped = groupUrls(urls);
const html = generateHTML(grouped);
fs.writeFileSync("sitemap.html", html, "utf8");

console.log("✅ sitemap.xml and sitemap.html generated successfully");
