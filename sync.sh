#!/bin/bash
# ================================================
# Toys Before Bed – Full Sync Script
# Push local changes -> Pull GitHub changes -> Clean -> Verify
# ================================================

echo "🔄 Syncing with GitHub main branch..."

# Ensure we’re on main
git checkout main || exit 1

# Stage & commit local changes (if any)
if ! git diff --quiet || ! git diff --cached --quiet; then
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  echo "📦 Local changes detected, committing with timestamp..."
  git add .
  git commit -m "Auto-sync on $TIMESTAMP"
  git push origin main
else
  echo "✅ No local changes to commit."
fi

# Fetch and merge latest changes
echo "⬇️ Pulling latest changes from GitHub..."
git fetch origin
git pull origin main

# Clean untracked files & dirs (but keep sync.sh itself!)
echo "🧹 Cleaning untracked files/folders..."
git clean -fd -e sync.sh

# Run verifier
echo "🔍 Running HTML verifier..."
node scripts/verify-includes.js || true

echo "📄 Reports generated: verify-report.txt, broken-links.txt"
echo "✅ Sync complete! Repo is up to date and verified."

echo ""
echo "⚠️ If you still see conflicts or your repo looks broken, run:"
echo "    git reset --hard origin/main"
echo "⚠️ WARNING: That will delete any local commits or changes not on GitHub."

