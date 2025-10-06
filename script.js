document.addEventListener('DOMContentLoaded', () => {
    // ===========================================
    // 1. 모바일 햄버거 메뉴 토글 로직
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
        });

        // 메뉴 링크 클릭 시 메뉴 닫기
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===========================================
    // 2. 폼 (Formspree) 제출 로직 (이전에 복구해 드린 내용)
    // ===========================================
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');

    const setStatus = (msg) => {
        if (statusEl) statusEl.textContent = msg;
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const lang = document.documentElement.lang.toUpperCase();
            let sendingMsg = (lang === 'KO') ? '전송 중...' : (lang === 'ZH-CN') ? '发送中...' : 'Sending...';
            setStatus(sendingMsg);

            try {
                const data = new FormData(form);
                // HTML의 Formspree 액션 URL은 'https://formspree.io/f/YOUR_FORM_ID' 이므로,
                // 실제 배포 시에는 반드시 이 부분을 변경해야 합니다.
                const res = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    form.reset();
                    let successMsg = (lang === 'KO') ? '메시지가 전송되었습니다. 곧 연락드릴게요!' : (lang === 'ZH-CN') ? '信息已成功发送。我们会尽快联系您！' : 'Message sent successfully. We will contact you soon!';
                    setStatus(successMsg);
                } else {
                    let failMsg = (lang === 'KO') ? '전송에 실패했습니다. 잠시 후 다시 시도해주세요.' : (lang === 'ZH-CN') ? '发送失败。请稍后重试。' : 'Failed to send. Please try again later.';
                    try {
                        const json = await res.json();
                        if (json && json.errors && json.errors.length) {
                            failMsg = json.errors.map(e => e.message).join(', ');
                        }
                    } catch (_) {}
                    setStatus(failMsg);
                }
            } catch (err) {
                let networkErrorMsg = (lang === 'KO') ? '네트워크 오류가 발생했습니다. 다시 시도해주세요.' : (lang === 'ZH-CN') ? '发生网络错误。请重试。' : 'A network error occurred. Please try again.';
                setStatus(networkErrorMsg);
            }
        });
    }

    // ===========================================
    // 3. 스크롤 애니메이션 로직 (Scroll Reveal)
    // ===========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const checkVisibility = () => {
        const windowHeight = window.innerHeight;
        
        fadeElements.forEach(el => {
            const elTop = el.getBoundingClientRect().top;
            const elVisible = 150; // 요소가 화면의 이 픽셀만큼 보였을 때 애니메이션 실행 (조절 가능)

            if (elTop < windowHeight - elVisible) {
                el.classList.add('is-visible');
            } else {
                 // 화면 밖으로 나갔을 때 애니메이션을 리셋하고 싶다면 이 부분을 활성화 (선택 사항)
                 // el.classList.remove('is-visible'); 
            }
        });
    };

    // 초기 로드 시 한 번 실행
    checkVisibility();

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', checkVisibility);

    // 년도 자동 업데이트
    document.getElementById('year').textContent = new Date().getFullYear();
});
