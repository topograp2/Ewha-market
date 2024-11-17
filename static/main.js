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
    updateSubcategoryPosition();
  });
});

function updateSubcategoryPosition() {
  const activeElement = document.querySelector('.category-nav a.active');
  const subcategoryNav = document.getElementById('subcategory');
  const rect = activeElement.getBoundingClientRect();
  subcategoryNav.style.marginLeft = `${rect.left-70}px`;
  subcategoryNav.style.visibility = 'visible';
}