function getPath(levels) {
  return Array(levels).fill("..").join("/") || ".";
}

const depth = window.location.pathname.split("/").length - 2;
const basePath = getPath(depth);

document.addEventListener("DOMContentLoaded", () => {
  fetch(`${basePath}/includes/navbar.html`)
    .then(res => res.text())
    .then(data => document.getElementById("navbar-include").innerHTML = data);

  fetch(`${basePath}/includes/footer.html`)
    .then(res => res.text())
    .then(data => document.getElementById("footer-include").innerHTML = data);
});
