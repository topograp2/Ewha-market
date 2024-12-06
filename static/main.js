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

