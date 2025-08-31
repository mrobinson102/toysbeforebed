document.addEventListener("DOMContentLoaded", () => {
  fetch("/footer.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("footer-container").innerHTML = data;
      // Update date
      const dateEl = document.getElementById("last-updated");
      if (dateEl) {
        dateEl.textContent = new Date(document.lastModified).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
      }
    })
    .catch(err => console.error("Footer load error:", err));
});
