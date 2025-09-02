// Dynamically load navbar and footer with correct relative paths
document.addEventListener("DOMContentLoaded", () => {
  // Calculate how deep the current page is (root, /products/, /blog/, etc.)
  const depth = window.location.pathname.split("/").length - 2;
  const basePath = depth > 0 ? "../".repeat(depth) : "./";

  function generateBreadcrumbs() {
    const path = window.location.pathname.replace(/\/$/, "");
    const segments = path.split("/").filter(p => p && p !== "index.html");
    const bc = document.getElementById("breadcrumbs");
    if (!bc) return;

    let html = `<a href="/index.html">Home</a>`;
    let cumulative = "";
    segments.forEach((seg, idx) => {
      cumulative += "/" + seg;
      const label = decodeURIComponent(seg)
        .replace(/\.html$/, "")
        .split("-")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");
      if (idx < segments.length - 1) {
        html += `<span>&gt;</span><a href="${cumulative}">${label}</a>`;
      } else {
        html += `<span>&gt;</span>${label}`;
      }
    });
    bc.innerHTML = html;
  }

  // Load Navbar
  fetch(basePath + "includes/navbar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("navbar");
      if (container) {
        container.innerHTML = html;

        // Inject breadcrumbs placeholder
        fetch(basePath + "includes/breadcrumbs.html")
          .then(res => res.text())
          .then(bcHtml => {
            container.insertAdjacentHTML("afterend", bcHtml);
            generateBreadcrumbs();
          })
          .catch(err => console.error("Breadcrumb load error:", err));
      }
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
