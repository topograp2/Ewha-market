let imgCount = 0;
document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.querySelector('input[name="img_path"]');  // 이미지 업로드 input
    const imagePreview = document.querySelector('.image-preview');  // 이미지 미리보기 div
    const uploadButton = document.querySelector('.upload');  // 이미지 업로드 버튼

    // 업로드 버튼 클릭 시 파일 선택
    uploadButton.addEventListener('click', function () {
        imageInput.click();  // 파일 선택 input 클릭
        imgCount = 1
    });

    // 파일이 선택되었을 때 미리보기
    imageInput.addEventListener('change', function (event) {
        const file = event.target.files[0];  // 선택된 파일 가져오기

        if (file) {
            const reader = new FileReader();  // 파일을 읽을 FileReader 객체 생성

            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="이미지 미리보기" />`;  // 이미지 미리보기 표시
            };

            reader.readAsDataURL(file);  // 파일을 데이터 URL로 읽기
        } else {
            imagePreview.innerHTML = "(이미지 등록)";  // 이미지가 선택되지 않은 경우 기본 텍스트 표시
        }
    });
});

// major_category에 따른 sub category 변경

// major_category 별 subcategory
const detailOptions = {
    의류: [
        { value: "학잠/과잠", text: "학잠/과잠" },
        { value: "후리스", text: "후리스" },
        { value: "주경바막/돕바", text: "주경바막/돕바" },
        { value: "기타(의류)", text: "기타" }
    ],
    문구: [
        { value: "노트/플래너", text: "노트/플래너" },
        { value: "필기구", text: "필기구" },
        { value: "엽서/스티커", text: "엽서/스티커" },
        { value: "기타(문구)", text: "기타" }
    ],
    푸드: [
        { value: "베이킹", text: "베이킹" },
        { value: "음료", text: "음료" },
        { value: "기타(푸드)", text: "기타" }
    ],
    잡화: [
        { value: "인형/키링/뱃지", text: "인형/키링/뱃지" },
        { value: "에코백/파우치", text: "에코백/파우치" },
        { value: "텀블러/머그컵", text: "텀블러/머그컵" },
        { value: "기타(잡화)", text: "기타" }
    ]
};
// select 요소 가져오기
const majorCategory = document.querySelector('#major_category');
const detailCategory = document.querySelector("#detail_category");

// major_category 값이 변경될 때 이벤트
majorCategory.addEventListener("change", ()=>{
    const selectedValue = majorCategory.value;
    // detail카테고리 초기화
    detailCategory.innerHTML = "";
    // 메이저 카테고리에 맞는 detail 카테고리 추가
    detailOptions[selectedValue].forEach(option => {
        const newOption = document.createElement("option");
        newOption.value = option.value;
        newOption.textContent = option.text;
        detailCategory.appendChild(newOption);
        
    });
})

// 배송방법 선택 체크
const deliveryMethod = document.querySelector('.radio-div');
let checkDelivery = 0;
deliveryMethod.addEventListener("change", ()=>{
    checkDelivery = 1;
})

// 상품이름 작성 체크
const itemName = document.querySelector('input[name="item"]');
let checkItemName = 0;
itemName.addEventListener("input", ()=>{
    checkItemName = 1;
})

// 가격 작성 체크
const priceWrite = document.querySelector('input[name="price"]');
let checkPrice = 0;
priceWrite.addEventListener("input", ()=>{
    checkPrice = 1;
})

// 판매 지역 체크
const addrWrite = document.querySelector('input[name="addr"]');
let checkAddr = 0;
addrWrite.addEventListener("input", ()=>{
    checkAddr = 1;
})

// 상품 설명 체크
let checkItemexp = 0;
document.addEventListener('DOMContentLoaded', ()=> {
    const textarea = document.querySelector('textarea[name="itemexp"]')
    textarea.addEventListener('keyup', ()=>{
        checkItemexp = textarea.value.length;
    })
})

const submitBtn = document.querySelector(".reg-item-container");
submitBtn.addEventListener("submit", (e) => {
    if(imgCount===0){
        e.preventDefault();
        alert("사진을 등록해주세요!");
    }
    else if(checkDelivery === 0){
        e.preventDefault();
        alert("배송 방법을 선택해주세요!");
    }
    else if(checkItemName === 0){
        e.preventDefault();
        alert("상품 이름을 입력해주세요!");
    }
    else if(checkPrice === 0){
        e.preventDefault();
        alert("상품 가격을 입력해주세요!");
    }
    else if(checkAddr === 0){
        e.preventDefault();
        alert("판매 지역을 입력해주세요!");
    }
    else if(checkItemexp === 0){
        e.preventDefault();
        alert("상품 설명을 입력해주세요!");
    }
    else {
        //alert("리뷰가 성공적으로 등록되었습니다.");
        submitBtn.submit();
    }
})