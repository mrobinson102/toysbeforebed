const fs = require("fs");
const path = require("path");

function checkFile(filePath, depth) {
  const html = fs.readFileSync(filePath, "utf8");
  const rel = depth === 0 ? "" : "../";

  const results = [];

  if (!html.includes('<div id="navbar"></div>'))
    results.push("[FAIL] missing navbar include");

  if (!html.includes('<div id="footer"></div>'))
    results.push("[FAIL] missing footer include");

  if (!html.includes(`<script src="${rel}scripts/include.js" defer></script>`))
    results.push("[FAIL] script path incorrect");

  if (!html.includes(`<link href="${rel}styles/styles.css" rel="stylesheet">`))
    results.push("[FAIL] stylesheet path incorrect");

  if (results.length === 0) {
    console.log(`[PASS] ${filePath}`);
  } else {
    console.log(`[FAIL] ${filePath}`);
    results.forEach(r => console.log("  " + r));
    process.exitCode = 1;
  }
}

function walk(dir, depth = 0) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (file !== "includes") {
        walk(filepath, depth + 1);
      }
    } else if (file.endsWith(".html")) {
      checkFile(filepath, depth);
    }
  });
}

walk(".");
