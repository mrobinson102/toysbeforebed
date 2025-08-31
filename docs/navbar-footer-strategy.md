# Global Navbar & Footer Includes

## Goal
Maintain a single source of truth for the site's navigation and footer.

---

## Implementation

### 1. Shared Navbar (`/includes/navbar.html`)
```html
<nav class="navbar">
  <ul class="nav-list">
    <li><a href="/index.html">Home</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/join.html">Join Us</a></li>
    <li><a href="/faq.html">FAQ</a></li>
    <li><a href="/contact.html">Contact</a></li>
    <li><a href="/privacy.html">Privacy</a></li>
    <li><a href="/terms.html">Terms</a></li>
  </ul>
</nav>
```

### 2. Shared Footer (`/includes/footer.html`)
```html
<div class="footer-hero-strip">
  <p>Discreet Shipping • Inclusive Designs • 100% Comfort Guarantee</p>
</div>

<footer class="footer">
  <div class="footer-links">
    <a href="/faq.html">FAQ</a> |
    <a href="/contact.html">Contact</a> |
    <a href="/privacy.html">Privacy (US)</a> |
    <a href="/privacy-uk.html">Privacy (UK)</a> |
    <a href="/terms.html">Terms</a> |
    <a href="/returns.html">Returns</a> |
    <a href="/2257.html">2257 Compliance</a> |
    <a href="/sitemap.html">Sitemap</a>
  </div>

  <p>© 2025 Toys Before Bed™ — Curated for all bodies, every night.</p>
  <p>Last updated: <span id="last-updated"></span></p>
  <p><a href="#top" class="back-to-top">↑ Back to Top</a></p>
</footer>

<script>
  // Auto-update footer date
  document.getElementById("last-updated").textContent =
    new Date(document.lastModified).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
</script>
```

### 3. Loader Script (`/scripts/include.js`)
```javascript
// Dynamically load shared HTML includes
function loadInclude(id, file) {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch " + file);
      return response.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
    })
    .catch(err => console.error("Include error:", err));
}

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  if (navbar) loadInclude("navbar", "/includes/navbar.html");

  const footer = document.getElementById("footer");
  if (footer) loadInclude("footer", "/includes/footer.html");
});
```

### 4. Page Usage
```html
<body>
  <!-- Navbar auto-load -->
  <div id="navbar"></div>
  <script src="/scripts/include.js" defer></script>

  <!-- Page-specific content -->

  <!-- Footer auto-load -->
  <div id="footer"></div>
</body>
```

### CI Check (GitHub Actions)
```yaml
name: Verify Navbar & Footer Includes

on: [push, pull_request]

jobs:
  check-includes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          for file in $(find . -name "*.html"); do
            grep -q 'id="navbar"' "$file" || (echo "Missing navbar in $file" && exit 1)
            grep -q 'id="footer"' "$file" || (echo "Missing footer in $file" && exit 1)
          done
```
