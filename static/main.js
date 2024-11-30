const currentPath = window.location.pathname;
const navLinks = document.querySelectorAll('.navbar__menu > li > a');
navLinks.forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const categoryLinks = document.querySelectorAll('.category-nav a');
  const subcategories = document.querySelectorAll('.subcategory-nav');

  // 초기값: 첫 번째 카테고리와 서브카테고리 활성화
  if (categoryLinks.length > 0 && subcategories.length > 0) {
    categoryLinks[0].classList.add('active');
    subcategories[0].classList.add('active');
  }

  categoryLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault(); // 기본 링크 동작 방지
      const targetId = link.getAttribute('data-target');

      // 모든 서브 카테고리를 숨김
      subcategories.forEach(subcategory => {
        subcategory.classList.remove('active');
      });

      // 모든 링크에서 active 제거
      categoryLinks.forEach(link => {
        link.classList.remove('active');
      });

      // 선택된 서브 카테고리 표시 및 링크 강조
      const targetSubcategory = document.getElementById(targetId);
      if (targetSubcategory) {
        targetSubcategory.classList.add('active');
        link.classList.add('active');
      }
    });
  });
});

const idContainer = document.querySelector(".id-container");
idContainer.addEventListener("click", ()=>{
  window.location.href="/my_page";
})

function goBack(){
  history.go(-1);
}