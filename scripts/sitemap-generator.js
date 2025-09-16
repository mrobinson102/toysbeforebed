const fs = require("fs");
const path = require("path");

const baseUrl = "https://toysbeforebed.com";

// folders/files to exclude
const excludeDirs = ["node_modules", "includes", ".github"];
const excludeFiles = ["404.html"];

function generateSitemap(dir) {
  let urls = [];

  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      if (!excludeDirs.includes(file)) {
        urls = urls.concat(generateSitemap(filepath));
      }
    } else if (file.endsWith(".html") && !excludeFiles.includes(file)) {
      const relativePath = path.relative(".", filepath).replace(/\\/g, "/");
      urls.push(`
  <url>
    <loc>${baseUrl}/${relativePath}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`);
    }
  });

  return urls;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${generateSitemap(".").join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemap, "utf8");
console.log("✅ Sitemap updated without includes/ and node_modules/");
