const goBackBtn = document.querySelector(".back-btn-container");
goBackBtn.style.cursor = "pointer";
goBackBtn.addEventListener("click", ()=>{
    history.go(-1);
})