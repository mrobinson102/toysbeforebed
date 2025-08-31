# Final Footer + Navbar Strategy

## Goal
Unify navbar and footer across all pages so they are managed in **one file each** (`navbar.html` and `footer.html`), loaded dynamically via JavaScript.

---

## Implementation

### 1. Shared Navbar (`navbar.html`)
```html
<nav class="navbar">
  <ul class="nav-list">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="join.html">Join Us</a></li>
    <li><a href="faq.html">FAQ</a></li>
    <li><a href="contact.html">Contact</a></li>
    <li><a href="privacy.html">Privacy</a></li>
    <li><a href="terms.html">Terms</a></li>
  </ul>
</nav>
```

### 2. Shared Footer (`footer.html`)
```html
<div class="footer-hero-strip">
  <p>Discreet Shipping • Inclusive Designs • 100% Comfort Guarantee</p>
</div>
<footer class="footer">
  <p>
    <a href="faq.html">FAQ</a> | 
    <a href="contact.html">Contact</a> | 
    <a href="privacy.html">Privacy (US)</a> | 
    <a href="privacy-uk.html">Privacy (UK)</a> | 
    <a href="terms.html">Terms</a> | 
    <a href="returns.html">Returns</a> | 
    <a href="2257.html">2257 Compliance</a> | 
    <a href="sitemap.html">Sitemap</a>
  </p>
  <p>© 2025 Toys Before Bed™ — Curated for all bodies, every night.</p>
  <p>Last updated: <span id="last-updated"></span></p>
  <p><a href="#top" class="back-to-top">↑ Back to Top</a></p>
</footer>
```

### 3. Loader Script (`scripts/includes.js`)
```javascript
// Load navbar + footer globally
function loadInclude(id, file) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;
      if (id === "footer-container") {
        document.getElementById("last-updated").textContent =
          new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
      }
    })
    .catch(err => console.error(`Error loading ${file}:`, err));
}

document.addEventListener("DOMContentLoaded", () => {
  loadInclude("navbar-container", "navbar.html");
  loadInclude("footer-container", "footer.html");
});
```

### 4. Page Usage
```html
<body>
  <div id="navbar-container"></div>

  <!-- Page-specific content -->

  <div id="footer-container"></div>
  <script src="scripts/includes.js"></script>
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
          for file in $(find . -name "*.html" ! -path "./navbar.html" ! -path "./footer.html"); do
            grep -q "navbar-container" "$file" || (echo "Missing navbar in $file" && exit 1)
            grep -q "footer-container" "$file" || (echo "Missing footer in $file" && exit 1)
          done
```
