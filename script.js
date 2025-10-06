// ---------------------------------------------------------
// 3. Contact Form Submission (문의하기 폼)
// ---------------------------------------------------------
// ... (생략) ...
            try {
// ... (생략) ...
                if (response.ok) {
                    // *** 이 부분 수정 ***
                    formStatus.innerHTML = '메시지가 성공적으로 전송되었습니다.<br>곧 연락드리겠습니다.'; 
                    // formStatus.textContent 대신 formStatus.innerHTML 사용
                    contactForm.reset();
                    // 성공 메시지 잠시 후 사라지도록 설정
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 5000);
                } else {
                    const data = await response.json();
                    if (data.error) {
                        formStatus.textContent = `전송 실패: ${data.error}`;
                    } else {
                        // *** 이 부분 수정 ***
                        formStatus.innerHTML = '메시지 전송에 실패했습니다.<br>이메일로 직접 보내주세요.';
                        // formStatus.textContent 대신 formStatus.innerHTML 사용
                    }
                }
// ... (생략) ...
