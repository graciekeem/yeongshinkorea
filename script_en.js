document.addEventListener("DOMContentLoaded", function() {
    
    // ---------------------------------------------------------
    // 1. Fade-in & Intersecting Observer (스크롤 애니메이션)
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
        // 이미 is-visible이 붙은 아이템(예: Hero 섹션)은 관찰하지 않음
        if (!el.classList.contains('is-visible')) {
            observer.observe(el);
        }
    });


    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle & Close (모바일 메뉴 열기/닫기)
    // ---------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            // 모바일 메뉴가 열렸을 때 본문 스크롤 잠금
            document.body.classList.toggle('no-scroll'); 
            
            // 햄버거 아이콘 <-> X 아이콘 토글 
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('no-scroll'); // 스크롤 잠금 해제
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // ---------------------------------------------------------
    // 3. Contact Form Submission (문의하기 폼)
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 폼의 subject 값에 따라 언어를 결정 (KR/EN/ZH)
            const subjectInput = contactForm.querySelector('input[name="_subject"]');
            const isEnglish = subjectInput && subjectInput.value.includes('(EN)');

            // 로딩 메시지
            formStatus.textContent = isEnglish ? 'Sending message...' : '메시지를 전송 중입니다...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    if (isEnglish) {
                         // 영문 성공 메시지
                        formStatus.innerHTML = 'Your message has been successfully sent.<br>We will contact you shortly.'; 
                    } else {
                        // 한국어/기타 성공 메시지
                        formStatus.innerHTML = '메시지가 성공적으로 전송되었습니다.<br>곧 연락드리겠습니다.';
                    }
                    
                    contactForm.reset();
                    // 성공 메시지 잠시 후 사라지도록 설정
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 5000);
                } else {
                    const data = await response.json();
                    if (data.error) {
                        formStatus.textContent = isEnglish ? `Submission failed: ${data.error}` : `전송 실패: ${data.error}`;
                    } else {
                        if (isEnglish) {
                            // 영문 실패 메시지
                            formStatus.innerHTML = 'Message sending failed.<br>Please send us an email directly.';
                        } else {
                            // 한국어/기타 실패 메시지
                            formStatus.innerHTML = '메시지 전송에 실패했습니다.<br>이메일로 직접 보내주세요.';
                        }
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
                if (isEnglish) {
                    // 영문 서버 오류 메시지
                    formStatus.innerHTML = 'Could not communicate with the server.<br>Please try again shortly.';
                } else {
                    // 한국어/기타 서버 오류 메시지
                    formStatus.innerHTML = '서버와 통신할 수 없습니다.<br>잠시 후 다시 시도해 주세요.';
                }
            }
        });
    }
});
