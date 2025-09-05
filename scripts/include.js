// Dynamically load navbar and footer with correct relative paths
document.addEventListener("DOMContentLoaded", () => {
  // Calculate how deep the current page is (root, /products/, /blog/, etc.)
  const depth = window.location.pathname.split("/").length - 2;
  const basePath = depth > 0 ? "../".repeat(depth) : "./";

  function updateLinks(container) {
    if (!container) return;
    container.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("/")) return;
      a.setAttribute("href", basePath + href);
    });
  }

  function renderBreadcrumbs(el) {
    if (!el) return;
    const path = window.location.pathname;
    const crumbs = [`<a href="${basePath}index.html">Home</a>`];

    if (path.includes("/blog/")) {
      crumbs.push(`<a href="${basePath}blog.html">Blog</a>`);
    } else if (path.includes("/bedside/")) {
      crumbs.push(`<a href="${basePath}bedside.html">Bedside Reading</a>`);
    } else if (path.includes("/products/")) {
      crumbs.push(`<a href="${basePath}index.html#products">Products</a>`);
    }

    const pageTitle = document.title.split("|")[0].trim();
    crumbs.push(`<span>${pageTitle}</span>`);

    el.innerHTML = crumbs.join('<span class="separator">&gt;</span>');
  }

  // Load Navbar
  fetch(basePath + "includes/navbar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("navbar");
      if (container) {
        container.innerHTML = html;
        updateLinks(container);
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
        updateLinks(container);

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

  // Breadcrumb skip list
  const noBreadcrumbs = [
    "index.html",
    "about.html",
    "join.html",
    "faq.html",
    "contact.html",
    "privacy.html",
    "privacy-uk.html",
    "terms.html",
    "returns.html",
    "2257.html",
    "sitemap.html",
    "thank-you.html"
  ];

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const breadcrumbEl = document.querySelector(".breadcrumb");

  if (noBreadcrumbs.includes(currentPage)) {
    if (breadcrumbEl) breadcrumbEl.remove();
  } else {
    renderBreadcrumbs(breadcrumbEl);
  }
});
