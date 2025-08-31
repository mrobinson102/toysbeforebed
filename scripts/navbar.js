document.addEventListener("DOMContentLoaded", () => {
  const rootPath = new URL("../", document.currentScript.src).pathname;
  const currentPath = window.location.pathname;
  let relative = currentPath.startsWith(rootPath)
    ? currentPath.slice(rootPath.length)
    : currentPath;
  const depth = relative.split("/").length - 1;
  const prefix = depth > 0 ? "../".repeat(depth) : "";

  fetch(prefix + "navbar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("navbar-container");
      if (container) {
        container.innerHTML = html;
        container.querySelectorAll("a").forEach(a => {
          const href = a.getAttribute("href");
          if (href && !href.startsWith("http") && !href.startsWith("#")) {
            a.setAttribute("href", prefix + href);
          }
        });
      }
    })
    .catch(err => console.error("Navbar load error:", err));
});
