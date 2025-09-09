name: Verify and Fix HTML

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  verify:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4
        with:
          persist-credentials: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Run verifier
        run: |
          npm install
          node scripts/verify-includes.js
          echo "✅ HTML include and link verification complete"

      - name: Upload reports
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: verify-reports
          path: |
            verify-report*.txt
            broken-links.txt

      - name: Auto-commit fixes
        if: success()
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "chore: auto-fix HTML includes and links" || echo "No changes to commit"
          git push
