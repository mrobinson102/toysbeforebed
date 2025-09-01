// Dynamically load navbar and footer with correct relative paths
document.addEventListener("DOMContentLoaded", () => {
  // Calculate how deep the current page is (root, /products/, /blog/, etc.)
  const depth = window.location.pathname.split("/").length - 2;
  const basePath = depth > 0 ? "../".repeat(depth) : "./";

  // Load Navbar
  fetch(basePath + "includes/navbar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("navbar");
      if (container) container.innerHTML = html;
    })
    .catch(err => console.error("Navbar load error:", err));

  // Load Footer
  fetch(basePath + "includes/footer.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("footer");
      if (container) {
        container.innerHTML = html;

        // Auto-update "Last updated" span
        const dateEl = document.getElementById("last-updated");
        if (dateEl) {
          dateEl.textContent = new Date(document.lastModified).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        }
      }
    })
    .catch(err => console.error("Footer load error:", err));
});
