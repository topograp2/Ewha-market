const checkbox = document.querySelector("#same-as-member");
const checkIcon = document.querySelector(".checkIcon");
const emailInput = document.querySelector("input[name='email'");
const telInput = document.querySelector("input[name='tel'");

let checkCnt = 0;
checkIcon.addEventListener("click", ()=>{
    checkCnt++;
    if(checkCnt %2 == 0){
        checkIcon.src = noCheckSvg;
        emailInput.value="";
        telInput.value="";
        
    } else {
        checkIcon.src = checkSvg;
        telInput.value=myTel;
        emailInput.value = myEmail;
    }
})
