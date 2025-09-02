const fs = require("fs");
const path = require("path");

let report = [];

function checkFile(filePath, depth) {
  const html = fs.readFileSync(filePath, "utf8");
  const rel = depth === 0 ? "" : "../";
  let status = "[PASS]";

  if (!html.includes('<div id="navbar"></div>'))
    status = "[FAIL] missing navbar include";

  if (!html.includes('<div id="footer"></div>'))
    status = "[FAIL] missing footer include";

  if (!html.includes(`<script src="${rel}scripts/include.js" defer></script>`))
    status = "[FAIL] script path incorrect";

  if (!html.includes(`<link href="${rel}styles/styles.css" rel="stylesheet">`))
    status = "[FAIL] stylesheet path incorrect";

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

// Print to console too
console.log(report.join("\n"));

// Exit non-zero if any FAIL
if (report.some(r => r.startsWith("[FAIL]"))) {
  process.exit(1);
}
