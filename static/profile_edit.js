// 비밀번호 유효성 저장
let isValidPw = false;
let isValidCheck = false;

const pwInput = document.querySelector("#profilePwInput");
const pwInputMsg = document.querySelector(".pw-input-msg");
const checkIconPath = document.querySelector(".pw-icon").querySelector("img");
//const checkIconPath = 0;
// 영문, 숫자, 특수문자 포함되는지 검사
pwInput.addEventListener("input", ()=>{
    const haveLetter = /[a-zA-Z]/.test(pwInput.value);
    const haveNumber = /\d/.test(pwInput.value);
    const haveSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwInput.value);

    // 모든 조건을 만족하는지 확인
    if(haveLetter && haveNumber && haveSpecialChar){
        isValidPw = true
        pwInputMsg.innerHTML = ""
        checkIconPath.src = checkIcon;

    } else {
        isValidPw = false;
        checkIconPath.src = nocheckIcon;
        pwInputMsg.innerHTML = "영문, 숫자, 특수기호를 포함하여 작성해주세요.";
    }
    
})

// 비밀번호 일치하는지 검사

const checkInput = document.querySelector("#check-input");
const checkIcon2 = document.querySelector(".pw-check-icon").querySelector("img");
const checkMsg = document.querySelector(".check-input-msg");

checkInput.addEventListener("input", ()=>{
    if(pwInput.value === checkInput.value){
        console.log("check!!")
        isValidCheck = true;
        checkMsg.innerHTML="";
        checkIcon2.src = checkIcon;
    } else{
        isValidCheck = false;
        checkMsg.innerHTML="비밀번호가 일치하지 않아요."
        checkIcon2.src = nocheckIcon;
    }
})

// 조건 만족 시에만 폼 제출 가능
const submitBtn = document.querySelector(".profile-edit-container");
submitBtn.addEventListener("submit", (e)=>
{
    if(!isValidPw){
        e.preventDefault();
        alert("영문, 숫자, 특수기호를 포함한 비밀번호로 변경해주세요.")
    } else if ( !isValidCheck ){
        e.preventDefault();
        alert("비밀번호 확인을 해주세요.")
    } else {
        alert("프로필 편집이 완료되었습니다!");
        submitBtn.submit();
    }
})