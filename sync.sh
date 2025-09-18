#!/bin/bash
set -e

LOGFILE="sync.log"
MAXSIZE=1000000  # ~1 MB

# Rotate log if too big
if [ -f "$LOGFILE" ] && [ $(stat -c%s "$LOGFILE") -gt $MAXSIZE ]; then
  ARCHIVE="sync-$(date +"%Y%m%d-%H%M%S").log"
  mv "$LOGFILE" "$ARCHIVE"
  echo "🌀 Rotated old log → $ARCHIVE"
fi

# Cleanup rotated logs older than 7 days
find . -maxdepth 1 -name "sync-*.log" -type f -mtime +7 -exec rm {} \; -exec echo "🧹 Removed old log {}" \;

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "----------------------------------------" | tee -a "$LOGFILE"
echo "🕒 Sync run started at $TIMESTAMP" | tee -a "$LOGFILE"

echo "🔄 Syncing with GitHub main branch..." | tee -a "$LOGFILE"
git checkout main >>"$LOGFILE" 2>&1
git fetch origin >>"$LOGFILE" 2>&1
git pull --rebase origin main | tee -a "$LOGFILE"

echo "🧹 Cleaning untracked files/folders..." | tee -a "$LOGFILE"
git clean -fd >>"$LOGFILE" 2>&1

echo "🔍 Running HTML verifier..." | tee -a "$LOGFILE"
node scripts/verify-includes.js || true

echo "🗺️ Regenerating sitemap..." | tee -a "$LOGFILE"
node scripts/sitemap-generator.js

echo "🧩 Injecting breadcrumbs..." | tee -a "$LOGFILE"
node scripts/inject-breadcrumbs.js

echo "📄 Reports generated: verify-report.txt, broken-links.txt" | tee -a "$LOGFILE"
echo "----------------------------------------" | tee -a "$LOGFILE"

if [ -f verify-report.txt ]; then
  echo "📑 VERIFY REPORT:" | tee -a "$LOGFILE"
  cat verify-report.txt | tee -a "$LOGFILE"
  echo "----------------------------------------" | tee -a "$LOGFILE"
fi

if [ -f broken-links.txt ]; then
  echo "❌ BROKEN LINKS:" | tee -a "$LOGFILE"
  cat broken-links.txt | tee -a "$LOGFILE"
  echo "----------------------------------------" | tee -a "$LOGFILE"
fi

echo "✅ Sitemap + breadcrumbs updated locally" | tee -a "$LOGFILE"

# Stage only sitemap + HTML files (ignore reports)
git add sitemap.xml sitemap.html *.html bedside/*.html blog/*.html products/*.html >>"$LOGFILE" 2>&1

# Commit only if changes exist
if ! git diff --cached --quiet; then
  echo "📋 The following files will be committed:" | tee -a "$LOGFILE"
  git diff --cached --name-only | tee -a "$LOGFILE"

  git commit -m "🔄 Auto-update sitemap + inject breadcrumbs via sync.sh" | tee -a "$LOGFILE"

  echo "----------------------------------------" | tee -a "$LOGFILE"
  echo "📌 Sitemap/breadcrumb updates detected → ready to push" | tee -a "$LOGFILE"
  echo "----------------------------------------" | tee -a "$LOGFILE"

  # Ask for confirmation before pushing
  read -p "❓ Do you want to push these changes to GitHub? [y/N] " confirm
  if [[ "$confirm" =~ ^[Yy]$ ]]; then
    git push origin main | tee -a "$LOGFILE"
    echo "🚀 Pushed sitemap + breadcrumb updates to GitHub" | tee -a "$LOGFILE"
    PUSHED="yes"
  else
    echo "❌ Skipped pushing changes" | tee -a "$LOGFILE"
    PUSHED="no"
  fi
else
  echo "ℹ️ No sitemap or breadcrumb changes to commit" | tee -a "$LOGFILE"
  PUSHED="no"
fi

ENDTIME=$(date +"%Y-%m-%d %H:%M:%S")
echo "🕒 Sync run finished at $ENDTIME" | tee -a "$LOGFILE"
echo "----------------------------------------" | tee -a "$LOGFILE"

# === Terminal summary ===
echo ""
echo "========================================"
echo "✅ Sync finished successfully"
if [ -s broken-links.txt ]; then
  echo "⚠️  Broken links were found — opening broken-links.txt..."
  sleep 2
  nano broken-links.txt
fi
if [[ "$PUSHED" == "yes" ]]; then
  echo "🚀 Changes were pushed to GitHub"
else
  echo "ℹ️ No changes pushed"
fi
echo "📜 Full log saved to $LOGFILE"
echo "========================================"
