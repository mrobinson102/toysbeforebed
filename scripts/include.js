// Dynamically load navbar, footer, and breadcrumbs

document.addEventListener("DOMContentLoaded", () => {
  const depth = window.location.pathname.split("/").length - 2;
  const basePath = depth > 0 ? "../".repeat(depth) : "./";
  const path = window.location.pathname;
  const showBreadcrumb = /^\/(products|blog|bedside)\//.test(path);

  function updateLinks(container) {
    if (!container) return;
    container.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href");
      if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#") || href.startsWith("/")) return;
      a.setAttribute("href", basePath + href);
    });
  }

  function buildBreadcrumbs() {
    const crumbs = ["<a href=\"/index.html\">Home</a>"];
    if (path.startsWith("/blog/")) {
      crumbs.push("<a href=\"/blog.html\">Blog</a>");
    } else if (path.startsWith("/bedside/")) {
      crumbs.push("<a href=\"/bedside.html\">Bedside Guides</a>");
    } else if (path.startsWith("/products/")) {
      crumbs.push("<a href=\"/index.html#products\">Products</a>");
    }
    const pageTitle = document.title.split("|")[0].trim();
    crumbs.push(`<span>${pageTitle}</span>`);
    return crumbs.join('<span class="separator">&gt;</span>');
  }

  // Load Navbar and inject breadcrumbs
  fetch(basePath + "includes/navbar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("navbar");
      if (container) {
        container.innerHTML = html;
        updateLinks(container);
        if (showBreadcrumb) {
          const bc = document.createElement("nav");
          bc.className = "breadcrumb";
          bc.innerHTML = buildBreadcrumbs();
          container.insertAdjacentElement("afterend", bc);
        }
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
