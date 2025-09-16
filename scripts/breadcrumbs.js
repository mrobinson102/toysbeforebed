document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("breadcrumbs");
  if (!container) return;

  // Figure out the current page path (relative inside site)
  const path = window.location.pathname.replace(/^\/+/, "");
  
  fetch("/includes/breadcrumbs.json")
    .then(res => res.json())
    .then(data => {
      // Pick config for current page
      const crumbs = data[path] || null;
      if (!crumbs) return;

      // Build breadcrumb trail
      container.innerHTML = `
        <nav class="breadcrumb">
          ${crumbs
            .map(
              (c, i) =>
                i < crumbs.length - 1
                  ? `<a href="${c.href}">${c.label}</a><span class="separator">›</span>`
                  : `<span>${c.label}</span>`
            )
            .join("")}
        </nav>`;
    })
    .catch(err => console.error("Breadcrumb load error:", err));
});
