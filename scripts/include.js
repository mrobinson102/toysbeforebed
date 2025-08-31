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
  // Navbar loader
  const navbar = document.getElementById("navbar");
  if (navbar) {
    loadInclude("navbar", "/includes/navbar.html");
  }

  // Footer loader
  const footer = document.getElementById("footer");
  if (footer) {
    loadInclude("footer", "/includes/footer.html");
  }
});
