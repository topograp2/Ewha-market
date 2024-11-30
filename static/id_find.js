document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("findForm");
    const resultDiv = document.getElementById("result");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        fetch('/find-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(response => {
            if (response.status === "success") {
                resultDiv.style.color = "green";
                resultDiv.textContent = `회원님의 아이디는 ${response.id} 입니다`;
            } else {
                resultDiv.style.color = "red";
                resultDiv.textContent = response.message;
            }
        })
        .catch(() => {
            resultDiv.style.color = "red";
            resultDiv.textContent = "오류가 발생했습니다. 다시 시도해주세요.";
        });
    });
});