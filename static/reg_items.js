document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.querySelector('input[name="img_path"]');  // 이미지 업로드 input
    const imagePreview = document.querySelector('.image-preview');  // 이미지 미리보기 div
    const uploadButton = document.querySelector('.upload');  // 이미지 업로드 버튼

    // 업로드 버튼 클릭 시 파일 선택
    uploadButton.addEventListener('click', function() {
        imageInput.click();  // 파일 선택 input 클릭
    });

    // 파일이 선택되었을 때 미리보기
    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];  // 선택된 파일 가져오기

        if (file) {
            const reader = new FileReader();  // 파일을 읽을 FileReader 객체 생성

            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="이미지 미리보기" />`;  // 이미지 미리보기 표시
            };

            reader.readAsDataURL(file);  // 파일을 데이터 URL로 읽기
        } else {
            imagePreview.innerHTML = "(이미지 등록)";  // 이미지가 선택되지 않은 경우 기본 텍스트 표시
        }
    });
});
