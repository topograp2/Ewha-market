const imageInput = document.querySelector('.real-upload');
const uploadButton = document.querySelector('.upload');
const imagePreview = document.getElementById('imagePreview');
const deletePopup = document.getElementById('deletePopup');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
let imgCount = 0;

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
    imagePreview.src = "static/svg/plusIcon.svg";  // 기본 아이콘으로 초기화
    imagePreview.style.width = '25px';
    imagePreview.style.height = '25px';

    deletePopup.style.display = 'none';  // 팝업 닫기
    imageInput.value = '';  // 파일 입력 초기화
    
});

// 삭제 취소 버튼 클릭 시 팝업 닫기
cancelDeleteBtn.addEventListener('click', function() {
    deletePopup.style.display = 'none';  // 팝업 닫기
});

// 글자수 count -> 폼 제출 시 10자 미만이면 제출 거부해야 함.
const reviewText = document.querySelector(".review-text");
const textCount = document.querySelector(".text-count");
let isItValidTextCnt = 0;
const countReviewText = (e) => {
    textCount.innerHTML = e.target.value.length;
    isItValidTextCnt = e.target.value.length;
}
reviewText.addEventListener("input", countReviewText);

const submitBtn = document.querySelector(".review-form");
submitBtn.addEventListener("submit", (e) => {

    if (isItValidTextCnt >= 10) {
        alert("리뷰가 성공적으로 등록되었습니다.");
        submitBtn.submit();
    } else {
        e.preventDefault();
        alert("리뷰를 최소 10자 이상 채워주세요!");
    }
})

// 뒤로 가기 만들기
function goBack() {
    history.go(-1);
}

//별점 관련
// hover 추가하는 게 좋을 거 같음!!
const goodsStars = document.querySelectorAll(".goods .star");
const deliverStars = document.querySelectorAll(".deliver .star");
let selectGoodsStar = 0;
for (let i = 0; i < 5; i++) {
    goodsStars[i].addEventListener("click", () => {
        selectGoodsStar = i;
        for (let t = 0; t <= i; t++) {
            goodsStars[t].querySelector("img").src = "static/svg/fullStarIcon.svg";
        }
        for (let t = i + 1; t < 5; t++) {
            goodsStars[t].querySelector("img").src = "static/svg/starIcon.svg";
        }
    })
}

for (let i = 0; i < 5; i++) {
    deliverStars[i].addEventListener("click", () => {
        for (let t = 0; t <= i; t++) {
            deliverStars[t].querySelector("img").src = "static/svg/fullStarIcon.svg";
        }
        for (let t = i + 1; t < 5; t++) {
            deliverStars[t].querySelector("img").src = "static/svg/starIcon.svg";
        }
    })
}


// 키워드 선택

const keywordSelect = document.querySelectorAll(".keyword-set");
keywordSelect.forEach(element => {
    element.addEventListener("click", () => {
        element.classList.toggle("active");
    })
});