const imageInput = document.querySelector('.real-upload');
const uploadButton = document.querySelector('.upload');
const imagePreview = document.getElementById('imagePreview');
const deletePopup = document.getElementById('deletePopup');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let imgCount = 0;
// 상품 이름의 placeholder 설정
const itemName = document.querySelector('.item-name-input');
itemName.placeholder = "상품 이름을 입력해주세요";


// 업로드 버튼 클릭 시 파일 선택
uploadButton.addEventListener('click', function () {
    if(imgCount == 0)
        imageInput.click();
});

// 이미지 클릭 시 삭제 여부 확인 팝업 표시
imagePreview.addEventListener('click', function() {
    // 이미지가 이미 업로드된 상태라면 삭제 팝업을 띄운다
    if (imgCount != 0) {
        deletePopup.style.display = 'block';  // 팝업 표시
    }
});

// 파일이 선택되면 미리보기 이미지 표시
imageInput.addEventListener('change', function(event) {
    if(imgCount != 0) return;
    imgCount++;
    const file = event.target.files[0];  // 선택한 파일
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            imagePreview.src = e.target.result;  // 선택된 파일의 URL로 이미지 변경
            imagePreview.style.objectFit = 'contain';  // 비율을 맞춰서 이미지 크기 조정
            imagePreview.style.width = '100%';  // 이미지가 부모 영역을 가득 채우도록
            imagePreview.style.height = '100%';
        };
        
        reader.readAsDataURL(file);
    }
});

// 삭제 확인 버튼 클릭 시 이미지 삭제
confirmDeleteBtn.addEventListener('click', function() {
    imgCount = 0;
    imagePreview.src = plusIcon;  // 기본 아이콘으로 초기화
    imagePreview.style.width = '25px';
    imagePreview.style.height = '25px';

    deletePopup.style.display = 'none';  // 팝업 닫기
    imageInput.value = '';  // 파일 입력 초기화
    
});

// 삭제 취소 버튼 클릭 시 팝업 닫기
cancelDeleteBtn.addEventListener('click', function() {
    deletePopup.style.display = 'none';  // 팝업 닫기
});



// 글자수 세기
const reviewText = document.querySelector(".review-text");
const textCount = document.querySelector(".text-count");
let isItValidTextCnt = 0;
const countReviewText = (e) => {
    textCount.innerHTML = e.target.value.length;
    isItValidTextCnt = e.target.value.length;
}
reviewText.addEventListener("input", countReviewText);

// 체크박스 된 거 세기
let checkCnt = 0;
//const checkBoxes =  document.querySelectorAll(".check-keyword");
//checkBoxes.forEach(checkbox =>{
    //checkbox.addEventListener("change", ()=>{
        //if(checkbox.checked){
            //checkCnt++;
        //}else{
            //checkCnt--;
        //}
    //})
//})


// 뒤로 가기 만들기
function goBack() {
    history.go(-1);
}

//별점 누르면 별 채워지도록 설정
const goodsStars = document.querySelectorAll(".goods .star");
const deliverStars = document.querySelectorAll(".deliver .star");
let selectGoodsStar = 0;
let checkGoodsStar = 0;
for (let i = 0; i < 5; i++) {
    goodsStars[i].addEventListener("click", () => {
        checkGoodsStar=1;
        selectGoodsStar = i;
        for (let t = 0; t <= i; t++) {
            goodsStars[t].querySelector("img").src = fullStarIcon;
        }
        for (let t = i + 1; t < 5; t++) {
            goodsStars[t].querySelector("img").src = emptyStarIcon;
        }
    })
}

let checkDeliverStar = 0;
for (let i = 0; i < 5; i++) {
    deliverStars[i].addEventListener("click", () => {
        checkDeliverStar=1;
        for (let t = 0; t <= i; t++) {
            deliverStars[t].querySelector("img").src = fullStarIcon;
        }
        for (let t = i + 1; t < 5; t++) {
            deliverStars[t].querySelector("img").src = emptyStarIcon;
        }
    })
}


// 키워드 선택 시 스타일 변경
const exclusives = [
    ["seller-good", "seller-bad"],
    ["info-good", "info-bad"],
    ["recom", "no-recom"]
];

const keywordSelect = document.querySelectorAll(".keyword-set");
// 글자수 count -> 폼 제출 시 10자 미만이면 제출 거부해야 함.
// 체크박스 미 선택 시 -> 폼 제출 거부
const submitBtn = document.querySelector(".review-form");
submitBtn.addEventListener("submit", (e) => {
    if(isItValidTextCnt < 10){
        e.preventDefault();
        alert("리뷰를 최소 10자 이상 채워주세요!");
    }
    else if(checkGoodsStar===0){
        e.preventDefault();
        alert("상품 별점을 최소 1개 이상 선택해주세요!");
    }
    else if(checkDeliverStar===0){
        e.preventDefault();
        alert("배송상태 별점을 최소 1개 이상 선택해주세요!");
    }
    else if(imgCount===0){
        e.preventDefault();
        alert("사진을 등록해주세요!");
    }
    else if(checkCnt === 0){
        e.preventDefault();
        alert("키워드를 최소 1개 이상 선택해주세요!");
    }
    else {
        
        alert("리뷰가 성공적으로 등록되었습니다.");
        submitBtn.submit();
    }
})
keywordSelect.forEach(label => {
    label.addEventListener("click", (event) => {
        event.preventDefault(); // 기본 동작 방지 (체크박스 클릭 반영 방지)
        const checkboxId = label.getAttribute("for");
        const checkbox = document.querySelector(`#${checkboxId}`);

        if (checkbox.checked) {
            // 이미 선택된 상태라면 해제
            checkCnt--;
            checkbox.checked = false;
            label.classList.remove("active");
        } else {
            // 새로운 선택 처리
            exclusives.forEach(group => {
                if (group.includes(checkboxId)) {
                    group.forEach(itemId => {
                        const otherCheckbox = document.querySelector(`#${itemId}`);
                        const otherLabel = document.querySelector(`label[for='${itemId}']`);

                        // 그룹 내 다른 체크박스 및 라벨 초기화
                        otherCheckbox.checked = false;
                        otherLabel.classList.remove("active");
                    });
                }
            });

            // 현재 선택 활성화
            checkCnt++;
            checkbox.checked = true;
            label.classList.add("active");
        }
    });
});

