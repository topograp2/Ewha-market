document.addEventListener("DOMContentLoaded", function() {
    const imageInput = document.querySelector('.hidden');  // 이미지 업로드 input
    const uploadButton = document.querySelector('.upload');  // 이미지 업로드 버튼
    let imageCount = 0;  // 이미지 개수 추적 (이미지가 추가될 때마다 증가)

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
                const baseY = rect.top;

                // 이미지의 위치 설정
                newImage.style.left = `${baseX}px`;
                newImage.style.top = `${baseY}px`;

                // 생성된 이미지를 body에 추가
                document.body.appendChild(newImage);

                imageCount++;
                imageInput.value = '';
            };

            reader.readAsDataURL(file);
        }
    });
});