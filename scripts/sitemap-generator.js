const fs = require("fs");
const path = require("path");

const baseUrl = "https://toysbeforebed.com"; // ✅ your live domain

function generateSitemap(dir, depth = 0) {
  let urls = [];

  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      urls = urls.concat(generateSitemap(filepath, depth + 1));
    } else if (file.endsWith(".html")) {
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
console.log("✅ Sitemap updated with absolute URLs!");
