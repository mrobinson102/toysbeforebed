function enterSite() {
  document.getElementById('age-gate').style.display = 'none';
  document.getElementById('site-content').style.display = 'block';
  localStorage.setItem('ageVerified', 'true');
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('ageVerified') === 'true') {
    document.getElementById('age-gate').style.display = 'none';
    document.getElementById('site-content').style.display = 'block';
  }
});
