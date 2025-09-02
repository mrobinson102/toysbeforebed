const fs = require("fs");
const path = require("path");

let report = [];
let fixed = [];

function fixFile(filePath, depth) {
  let html = fs.readFileSync(filePath, "utf8");
  const rel = depth === 0 ? "" : "../";

  let changed = false;

  if (!html.includes('<div id="navbar"></div>')) {
    html = html.replace(/<body[^>]*>/, m => `${m}\n<div id=\"navbar\"></div>`);
    changed = true;
  }

  if (!html.includes('<div id="footer"></div>')) {
    html = html.replace(/<\/body>/, `<div id=\"footer\"></div>\n</body>`);
    changed = true;
  }

  if (!html.includes(`<script src="${rel}scripts/include.js" defer></script>`)) {
    html = html.replace(/<\/body>/, `<script src=\"${rel}scripts/include.js\" defer></script>\n</body>`);
    changed = true;
  }

  if (!html.includes(`<link href="${rel}styles/styles.css" rel="stylesheet">`)) {
    html = html.replace(/<head[^>]*>/, m => `${m}\n<link href=\"${rel}styles/styles.css\" rel=\"stylesheet\">`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, "utf8");
    fixed.push(filePath);
  }
}

function checkFile(filePath, depth) {
  const html = fs.readFileSync(filePath, "utf8");
  const rel = depth === 0 ? "" : "../";
  let status = "[PASS]";

  if (!html.includes('<div id="navbar"></div>') ||
      !html.includes('<div id="footer"></div>') ||
      !html.includes(`<script src="${rel}scripts/include.js" defer></script>`) ||
      !html.includes(`<link href="${rel}styles/styles.css" rel="stylesheet">`)) {
    status = "[FIXED]";
    fixFile(filePath, depth);
  }

  report.push(`${status} ${filePath}`);
}

function walk(dir, depth = 0) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, depth + 1);
    } else if (file.endsWith(".html")) {
      checkFile(filepath, depth);
    }
  });
}

walk(".");
fs.writeFileSync("verify-report.txt", report.join("\n"), "utf8");

console.log(report.join("\n"));
if (fixed.length > 0) {
  console.log("Auto-fixed files:", fixed);
}

