const imgNum = document.querySelector("#img-count");

document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.querySelector('.real-upload');  // 이미지 업로드 input
    const uploadButton = document.querySelector('.upload');  // 이미지 업로드 버튼
    let imageCount = 0;  // 이미지 개수 추적 (이미지가 추가될 때마다 증가)
    const popup = document.getElementById('popup');  // 팝업
    const popupImage = document.getElementById('popup-image');  // 팝업 이미지
    const closeBtn = document.querySelector('.close-btn');  // 팝업 닫기 버튼
    const deleteBtn = document.getElementById('delete-btn');  // 삭제 버튼
    // 업로드 버튼 클릭 시 파일 선택
    uploadButton.addEventListener('click', function() {
        imageInput.click();  // 파일 선택 input 클릭
    });

    // 파일이 선택되었을 때 미리보기
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];  // 선택된 파일 가져오기

        if (file) {
            if(imageCount>7) {
                alert("최대 8개까지만 이미지를 추가할 수 있습니다.");
                return;
            }
            const reader = new FileReader();  // 파일을 읽을 FileReader 객체 생성

            reader.onload = function(e) {
                // 새로운 이미지 생성
                const newImage = document.createElement('img');
                newImage.src = e.target.result;  // 업로드된 파일을 미리보기 이미지로 설정
                newImage.alt = "이미지 미리보기";
                newImage.style.position = 'absolute';  // 절대 위치로 설정
                newImage.style.width = '120px';  // 이미지 가로 크기
                newImage.style.height = '70px';  // 이미지 세로 크기

                newImage.style.boxShadow = '-4px 0px 8px rgba(0, 0, 0, 0.2)';

                // 기준이 되는 좌표 가져오기
                const hiddenElement = document.querySelector('.upload');
                const rect = hiddenElement.getBoundingClientRect();

                const baseX = rect.right + 40*imageCount + 20;
                const baseY = rect.top+110;

                // 이미지의 위치 설정
                newImage.style.left = `${baseX}px`;
                newImage.style.top = `${baseY}px`;

                // 생성된 이미지를 body에 추가
                document.body.appendChild(newImage);

                newImage.addEventListener('click', function() {
                    openPopup(newImage);  // 이미지 클릭 시 팝업 띄우기
                });

                imageCount++;
                imgNum.innerHTML = imageCount;
                imageInput.value = '';
            };

            reader.readAsDataURL(file);
        }
    });

    function openPopup(image) {
        popup.style.display = 'flex';  // 팝업 보이기
        popupImage.src = image.src;  // 팝업 이미지 설정

        // 삭제 버튼 클릭 시 이미지 삭제
        deleteBtn.onclick = function() {
            deleteImage(image);  // 이미지 삭제
            popup.style.display = 'none';  // 팝업 닫기
        };
    }

    // 이미지 삭제
    function deleteImage(image) {
        document.body.removeChild(image);  // 이미지를 삭제
        imageCount--;
        imgNum.innerHTML = imageCount;  // 이미지 개수 감소
    }

    // 팝업 닫기 (X 버튼)
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';  // 팝업 닫기
    });

});


// 글자수 count -> 폼 제출 시 10자 미만이면 제출 거부해야 함.
const reviewText = document.querySelector(".review-text");
const textCount = document.querySelector(".text-count");
let isItValidTextCnt = 0;
const countReviewText = (e)=>{
    textCount.innerHTML = e.target.value.length;
    isItValidTextCnt = e.target.value.length;
}
reviewText.addEventListener("input", countReviewText);

const submitBtn = document.querySelector(".review-form");
submitBtn.addEventListener("submit", (e)=>{
    
    if(isItValidTextCnt >= 10){
        alert("리뷰가 성공적으로 등록되었습니다.");
        submitBtn.submit();
    } else {
        e.preventDefault();
        alert("리뷰를 최소 10자 이상 채워주세요!");
    }
})

// 뒤로 가기 만들기
function goBack(){
    history.go(-1);
}

//별점 관련
// hover 추가하는 게 좋을 거 같음!!
const goodsStars = document.querySelectorAll(".goods .star");
const deliverStars = document.querySelectorAll(".deliver .star");
let selectGoodsStar = 0;
for(let i = 0; i<5; i++){
    goodsStars[i].addEventListener("click", ()=>{
        selectGoodsStar = i;
        for(let t = 0; t<=i; t++){
            goodsStars[t].querySelector("img").src = "static/svg/fullStarIcon.svg";
        }
        for(let t = i+1; t<5; t++){
            goodsStars[t].querySelector("img").src = "static/svg/starIcon.svg";
        }
    })
}

for(let i = 0; i<5; i++){
    deliverStars[i].addEventListener("click", ()=>{
        for(let t = 0; t<=i; t++){
            deliverStars[t].querySelector("img").src = "static/svg/fullStarIcon.svg";
        }
        for(let t = i+1; t<5; t++){
            deliverStars[t].querySelector("img").src = "static/svg/starIcon.svg";
        }
    })
}


// 키워드 선택

const keywordSelect = document.querySelectorAll(".keyword-set");
keywordSelect.forEach(element => {
    element.addEventListener("click", ()=>{
        element.classList.toggle("active");
    })
});