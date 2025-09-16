#!/bin/bash
set -e

echo "🔄 Syncing with GitHub main branch..."

# Ensure we're on main
git checkout main
git fetch origin
git pull origin main

# Clean untracked files (optional safety)
echo "🧹 Cleaning untracked files/folders..."
git clean -fd

# --- Auto-regenerate sitemap ---
echo "🌍 Regenerating sitemap..."
node scripts/sitemap-generator.js || true

# Stage and commit sitemap updates if changed
if [[ -n $(git status --porcelain sitemap.*) ]]; then
  git add sitemap.*
  git commit -m "Auto-update sitemap before release"
  git push origin main
  echo "✅ Sitemap updated and pushed."
else
  echo "ℹ️ Sitemap already up-to-date."
fi

# --- Version bump logic ---
bump_type="patch" # default
if [[ $1 == "--bump" && $2 =~ ^(patch|minor|major)$ ]]; then
  bump_type=$2
fi

# Get last tag (or start at v1.0.0 if none)
last_tag=$(git tag --list "v*" --sort=-v:refname | head -n 1)
if [[ -z "$last_tag" ]]; then
  last_tag="v1.0.0"
fi

# Strip 'v' prefix
version=${last_tag#v}
IFS='.' read -r major minor patch <<< "$version"

case $bump_type in
  patch)
    patch=$((patch + 1))
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
esac

new_tag="v$major.$minor.$patch"

echo "🏷️ Bumping version: $last_tag → $new_tag"
git tag -a "$new_tag" -m "Release $new_tag"
git push origin "$new_tag"

# Run HTML verifier
echo "🔍 Running HTML verifier..."
node scripts/verify-includes.js || true

echo "📄 Reports generated: verify-report.txt, broken-links.txt"
echo "✅ Sync complete!"

