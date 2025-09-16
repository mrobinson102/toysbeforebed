const fs = require("fs");
const path = require("path");

const baseUrl = "https://toysbeforebed.com";

function getPriority(file) {
  if (file === "index.html") return { priority: "1.0", changefreq: "daily" };
  if (file.startsWith("products/") || file.startsWith("blog/")) {
    return { priority: "0.8", changefreq: "weekly" };
  }
  return { priority: "0.5", changefreq: "monthly" };
}

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else if (file.endsWith(".html")) {
      filelist.push(filepath.replace(/\\/g, "/"));
    }
  });
  return filelist;
}

const files = walk(".").filter(f => !f.includes("includes/") && !f.includes("node_modules/"));
const today = new Date().toISOString().split("T")[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

files.forEach(file => {
  const loc = `${baseUrl}/${file.replace("./", "")}`;
  const { priority, changefreq } = getPriority(file);

  xml += `  <url>\n`;
  xml += `    <loc>${loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority}</priority>\n`;
  xml += `  </url>\n`;
});

xml += `</urlset>\n`;

fs.writeFileSync("sitemap.xml", xml, "utf8");
console.log("✅ sitemap.xml generated with SEO priorities");
