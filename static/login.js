document.getElementById("pw-toggle-btn").addEventListener("click", function () {
    const passwordInput = document.getElementById("password-input");
    const pwIcon = document.getElementById("pw-icon");

    if (passwordInput.type === "password") {
        // 비밀번호 보이기
        passwordInput.type = "text";
        pwIcon.src = "static/svg/pwShow.svg";
        pwIcon.alt = "비밀번호 숨기기 버튼";
    } else {
        // 비밀번호 숨기기
        passwordInput.type = "password";
        pwIcon.src = "static/svg/pwHide.svg";
        pwIcon.alt = "비밀번호 보기 버튼";
    }
});