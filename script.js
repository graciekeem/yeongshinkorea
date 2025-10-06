// =========================================================
// General JavaScript Functions (script.js)
// =========================================================

document.addEventListener("DOMContentLoaded", function() {
    
    // ... (1, 2, 3번 섹션 - 생략) ...

    // ---------------------------------------------------------
    // 4. Contact Form Submission (수정된 부분)
    // ---------------------------------------------------------
    const form = document.getElementById('contactForm');
    if (form) {
        const statusEl = document.getElementById('formStatus');
        
        // 언어별 메시지 설정 (폼의 _subject 값으로 현재 언어 확인)
        const getFormMessages = (subject) => {
            if (subject.includes('(EN)')) {
                return { 
                    sending: 'Sending...', 
                    success: 'Message sent successfully! We will contact you shortly.', 
                    failure: 'Failed to send. Please try again later.', 
                    networkError: 'A network error occurred. Please try again.',
                    validationError: 'Please fill out all required fields correctly.' // 추가
                };
            } else if (subject.includes('(ZH)')) {
                return { 
                    sending: '发送中...', 
                    success: '消息已发送！我们将尽快与您联系！', 
                    failure: '发送失败。请稍后再试。', 
                    networkError: '发生网络错误。请重试。',
                    validationError: '请正确填写所有必填字段。' // 추가
                };
            } else { // KR (default)
                return { 
                    sending: '전송 중...', 
                    success: '메시지가 전송되었습니다. 곧 연락드릴게요!', 
                    failure: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 
                    networkError: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
                    validationError: '필수 항목을 모두 정확하게 입력해 주세요.' // 추가
                };
            }
        };

        const setStatus = (msg) => {
            if (statusEl) statusEl.textContent = msg;
        };
        
        // 이메일 유효성 검사 함수 (간단하게)
        const isValidEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const subjectInput = form.querySelector('input[name="_subject"]');
            const messages = getFormMessages(subjectInput ? subjectInput.value : '');

            // 🌟 폼 유효성 검사 로직 추가 🌟
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (nameInput.value.trim() === '' || emailInput.value.trim() === '' || messageInput.value.trim() === '') {
                setStatus(messages.validationError);
                return; // 필수 항목 누락 시 전송 중단
            }

            if (!isValidEmail(emailInput.value)) {
                setStatus(messages.validationError); // 이메일 형식 오류 메시지 (required와 통일)
                return; // 이메일 형식 오류 시 전송 중단
            }
            // 🌟 유효성 검사 로직 끝 🌟

            setStatus(messages.sending);

            try {
                const data = new FormData(form);
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    form.reset();
                    setStatus(messages.success);
                } else {
                    let msg = messages.failure;
                    try {
                        const json = await res.json();
                        // Formspree 오류 메시지 출력 시도
                        if (json && json.errors && json.errors.length) {
                             // Formspree에서 'required' 필드 오류가 나면 이 부분이 잡힘
                            msg = json.errors.map(e => e.message).join(', ') || messages.failure;
                        }
                    } catch (_) {}
                    setStatus(msg);
                }
            } catch (err) {
                setStatus(messages.networkError);
            }
        });
    }

});
