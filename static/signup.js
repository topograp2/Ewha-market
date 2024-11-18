const idCheckBtn = document.querySelector('#id-check-btn');
const signupForm = document.querySelector('form');
const pwCheckBtn = document.querySelector('#pw-check-btn');
const idCheckMsg = document.querySelector('#id-check-msg');
const pwCheckMsg = document.querySelector('#pw-check-msg');

let isIdValid = false;
let isPwValid = false;

async function checkId(event){
    event.preventDefault(); // 기본 동작 방식
    // 사용자가 input에 입력한 id
    const idInput = document.querySelector("input[name='id']").value;
    try{
        const response = await fetch("check_id", {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({id: idInput}),
        });

        const result = await response.json();
        if(result.exists){
            isIdValid = false;
            console.log("중목");
            idCheckMsg.innerHTML="중복된 아이디입니다."
        } else {
            isIdValid = true;
            idCheckMsg.innerHTML="사용가능한 아이디입니다."
        } 
    } catch(error){
        console.error("Error:", error);
        alert("아이디 확인 중 문제가 발생했습니다.");
        isIdValid = false;
    }

}

async function checkPw(event){
    event.preventDefault();
    const pwInput = document.querySelector("input[name='pw']").value;
    const pwConfirmInput = document.querySelector(".pw-confirm-input").value;
    
    if(pwInput != pwConfirmInput){
        pwCheckMsg.innerHTML="일치하지 않는 비밀번호입니다.";
        isPwValid = false;
    } else {
        pwCheckMsg.innerHTML="비밀번호 확인 완료.";
        isPwValid = true;
    }

}

function handleFormSubmit(event){
    if(!isIdValid){
        event.preventDefault();
        alert("아이디 확인이 필요합니다.");
    } else if (!isPwValid){
        event.preventDefault();
        alert("비밀번호 확인이 필요합니다.");
    } else {
        alert("이화마켓의 회원이 되셨습니다!");
        signupForm.submit();
    }
}

idCheckBtn.addEventListener("click", checkId);
pwCheckBtn.addEventListener("click", checkPw);
signupForm.addEventListener("submit", handleFormSubmit);
