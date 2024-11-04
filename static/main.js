const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.navbar__menu > li > a');
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

const cateLinks = document.querySelectorAll('.category-nav a');
cateLinks.forEach(link => {
  link.addEventListener('click', () => {
    event.preventDefault();
    cateLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});

const pageLinks = document.querySelectorAll('.pagination a');
pageLinks.forEach(link => {
  link.addEventListener('click', () => {
    event.preventDefault();
    pageLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');
  });
});