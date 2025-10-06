document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // 1. 모바일 햄버거 메뉴 토글 로직
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // ===========================================
    // 2. 문의하기 폼 (Formspree) 제출 로직
    // ===========================================
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');

    // 폼 상태 메시지 표시 함수
    const setStatus = (msg) => {
        if (statusEl) statusEl.textContent = msg;
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 현재 페이지의 언어 코드를 확인하여 '전송 중...' 메시지를 다국어 처리
            const lang = document.documentElement.lang.toUpperCase();
            let sendingMsg = 'Sending...';

            if (lang === 'KO') {
                sendingMsg = '전송 중...';
            } else if (lang === 'ZH-CN') {
                sendingMsg = '发送中...';
            }

            setStatus(sendingMsg);

            try {
                const data = new FormData(form);
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                // 성공 메시지 다국어 처리
                if (res.ok) {
                    form.reset();
                    let successMsg = 'Message sent successfully. We will contact you soon!';
                    if (lang === 'KO') {
                        successMsg = '메시지가 전송되었습니다. 곧 연락드릴게요!';
                    } else if (lang === 'ZH-CN') {
                        successMsg = '信息已成功发送。我们会尽快联系您！';
                    }
                    setStatus(successMsg);
                } 
                // 실패 메시지 다국어 처리 및 Formspree 에러 파싱
                else {
                    let failMsg = 'Failed to send. Please try again later.';
                    if (lang === 'KO') {
                        failMsg = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
                    } else if (lang === 'ZH-CN') {
                        failMsg = '发送失败。请稍后重试。';
                    }
                    
                    try {
                        const json = await res.json();
                        // Formspree에서 반환하는 구체적인 에러 메시지 사용
                        if (json && json.errors && json.errors.length) {
                            // 에러 메시지는 Formspree가 제공하므로 번역하지 않음.
                            failMsg = json.errors.map(e => e.message).join(', '); 
                        }
                    } catch (_) {}
                    setStatus(failMsg);
                }
            } catch (err) {
                // 네트워크 오류 메시지 다국어 처리
                let networkErrorMsg = 'A network error occurred. Please try again.';
                if (lang === 'KO') {
                    networkErrorMsg = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
                } else if (lang === 'ZH-CN') {
                    networkErrorMsg = '发生网络错误。请重试。';
                }
                setStatus(networkErrorMsg);
            }
        });
    }
});
