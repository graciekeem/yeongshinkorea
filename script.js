// =========================================================
// General JavaScript Functions (script.js)
// =========================================================

document.addEventListener("DOMContentLoaded", function() {
    
    // ---------------------------------------------------------
    // 1. Fade-in & Intersecting Observer
    // ---------------------------------------------------------
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 일반 fade-in 애니메이션
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('is-visible');
                }
                // 바이어 갤러리 애니메이션 (순차적 등장)
                if (entry.target.classList.contains('buyer-gallery')) {
                    entry.target.classList.add('is-visible');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });

    // fade-in 클래스와 buyer-gallery 클래스 모두 관찰 대상에 추가
    document.querySelectorAll('.fade-in, .buyer-gallery').forEach(el => {
        observer.observe(el);
    });


    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle
    // ---------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            // 햄버거 아이콘 <-> X 아이콘 토글 
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // ---------------------------------------------------------
    // 3. Mobile Menu Link Click (메뉴 닫기)
    // ---------------------------------------------------------
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu) mobileMenu.classList.remove('open');
            const toggleIcon = menuToggle ? menuToggle.querySelector('i') : null;
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
    });

  // =========================================================
// 4. Contact Form Submission (폼 유효성 검사 로직)
// =========================================================
const form = document.getElementById('contactForm');
if (form) {
    const statusEl = document.getElementById('formStatus');
    // ... (중략) ...
    
    form.addEventListener('submit', async (e) => {
        // ... (중략: 유효성 검사 로직) ...

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
                
                // 🌟🌟🌟 이 부분 추가 🌟🌟🌟
                // 전송 성공 후 버튼의 초점(Focus)을 강제로 해제하여 외곽선을 없앱니다.
                const submitBtn = form.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.blur();
                }
                // 🌟🌟🌟 추가 끝 🌟🌟🌟

            } else {
                // ... (중략: 전송 실패 로직) ...
            }
        } catch (err) {
            // ... (중략: 네트워크 오류 로직) ...
        }
    });
}
