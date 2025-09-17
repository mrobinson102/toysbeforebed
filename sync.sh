#!/bin/bash
set -e

echo "🔄 Syncing with GitHub main branch..."
git checkout main
git fetch origin
git pull --rebase origin main

echo "🧹 Cleaning untracked files/folders..."
git clean -fd

echo "🔍 Running HTML verifier..."
node scripts/verify-includes.js || true

echo "🗺️ Regenerating sitemap..."
node scripts/sitemap-generator.js

echo "🧩 Injecting breadcrumbs..."
node scripts/inject-breadcrumbs.js

echo "📄 Reports generated: verify-report.txt, broken-links.txt"
echo "----------------------------------------"
if [ -f verify-report.txt ]; then
  echo "📑 VERIFY REPORT:"
  cat verify-report.txt
  echo "----------------------------------------"
fi

if [ -f broken-links.txt ]; then
  echo "❌ BROKEN LINKS:"
  cat broken-links.txt
  echo "----------------------------------------"
fi

echo "✅ Sitemap + breadcrumbs updated locally"

# Stage only sitemap + HTML files (ignore reports)
git add sitemap.xml sitemap.html *.html bedside/*.html blog/*.html products/*.html

# Commit only if changes exist
if ! git diff --cached --quiet; then
  echo "📋 The following files will be committed:"
  git diff --cached --name-only

  git commit -m "🔄 Auto-update sitemap + inject breadcrumbs via sync.sh"

  # Ask for confirmation before pushing
  read -p "❓ Do you want to push these changes to GitHub? [y/N] " confirm
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    git push origin main
    echo "🚀 Pushed sitemap + breadcrumb updates to GitHub"
  else
    echo "❌ Skipped pushing changes"
  fi
else
  echo "ℹ️ No sitemap or breadcrumb changes to commit"
fi

# 🔹 Cleanup: remove report files if they exist
rm -f verify-report.txt broken-links.txt
echo "🧹 Cleaned up temporary report files"

# 🔹 Normalize line endings (fix LF vs CRLF warnings)
git config core.autocrlf true
git add --renormalize .
echo "✅ Normalized line endings to Windows-friendly CRLF"

