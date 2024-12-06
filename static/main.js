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

document.querySelector('.search-btn').addEventListener('click', (e) => {
  const searchInput = document.querySelector('.search-input');
  if (searchInput.value === "") {
    alert('검색어를 입력해주세요!');
    e.preventDefault();
  }
});
if (idSession != "") {
  const idContainer = document.querySelector(".id-container");
  idContainer.addEventListener("click", () => {
    const userId = idContainer.textContent;
    window.location.href = `/my_page/${userId}`;
  })
  const logoutBtn = document.querySelector('.logout-container');
  logoutBtn.style = "cursor:pointer";
  logoutBtn.addEventListener("click", () => {
    window.location.href = "/logout";
  })
}


function goBack() {
  history.go(-1);
}

