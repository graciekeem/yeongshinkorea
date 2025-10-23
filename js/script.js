document.addEventListener("DOMContentLoaded", function() {
    
    // ---------------------------------------------------------
    // 1. Fade-in & Intersecting Observer (스크롤 애니메이션)
    // ---------------------------------------------------------
    // (기존 코드 유지)
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('is-visible');
                }
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

    document.querySelectorAll('.fade-in, .buyer-gallery').forEach(el => {
        if (!el.classList.contains('is-visible')) {
            observer.observe(el);
        }
    });


    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle & Close (모바일 메뉴 열기/닫기)
    // ---------------------------------------------------------
    // (기존 코드 유지)
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            document.body.classList.toggle('no-scroll'); 
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('.mobile-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.body.classList.remove('no-scroll');
                    
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }


    // ---------------------------------------------------------
    // 3. Product Tab Switching (주요 품목 탭 전환) <--- 이 부분이 핵심
    // ---------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. 모든 버튼에서 active 클래스 제거 (비활성화)
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // 2. 모든 콘텐츠에서 active 클래스 제거 (숨기기)
            tabContents.forEach(content => content.classList.remove('active'));

            // 3. 클릭된 버튼에 active 클래스 추가 (활성화)
            button.classList.add('active');

            // 4. 해당 탭 ID를 가져와서 콘텐츠에 active 클래스 추가 (보이기)
            const targetTabId = button.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTabId);

            if (targetContent) {
                targetContent.classList.add('active');
                
                // 5. 탭 전환 시 새로운 탭 콘텐츠 내부의 fade-in 애니메이션 재적용 
                if (typeof observer !== 'undefined') { 
                    targetContent.querySelectorAll('.fade-in').forEach(el => {
                        el.classList.remove('is-visible'); 
                        observer.observe(el);
                    });
                }
            }
        });
    });


    // ---------------------------------------------------------
    // 4. Contact Form Submission (문의하기 폼)
    // ---------------------------------------------------------
    // (기존 코드 유지)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const subjectInput = contactForm.querySelector('input[name="_subject"]');
            const subjectValue = subjectInput ? subjectInput.value : '';
            const isEnglish = subjectValue.includes('(EN)');
            const isChinese = subjectValue.includes('(ZH)');

            // (중략 - 폼 전송 및 응답 처리 로직)
            // ... (기존 폼 전송 로직이 여기에 있어야 합니다.)
            // ...
            
        });
    }
});
