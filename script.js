document.addEventListener("DOMContentLoaded", function() {
    
    // ---------------------------------------------------------
    // 1. Fade-in & Intersecting Observer (스크롤 애니메이션)
    // (기존 코드 유지)
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

    document.querySelectorAll('.fade-in, .buyer-gallery').forEach(el => {
        if (!el.classList.contains('is-visible')) {
            observer.observe(el);
        }
    });


    // ---------------------------------------------------------
    // 2. Mobile Menu Toggle & Close (모바일 메뉴 열기/닫기)
    // ---------------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // [핵심 점검]: 요소를 제대로 찾았는지 확인
    if (!menuToggle) {
        console.error("Error: .menu-toggle (햄버거 버튼)을 찾을 수 없습니다. HTML 클래스 이름을 확인하세요.");
        return; 
    }
    if (!mobileMenu) {
        console.error("Error: .mobile-menu (모바일 메뉴 영역)을 찾을 수 없습니다. HTML 클래스 이름을 확인하세요.");
        return; 
    }
    
    // 이벤트 리스너 추가
    menuToggle.addEventListener('click', function() {
        console.log("Menu toggle clicked."); // 클릭 이벤트 발생 확인

        // 메뉴 클래스 토글 (메뉴를 보이게 하는 CSS 클래스)
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll'); 
        
        // 아이콘 토글 (bars <-> times)
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // 모바일 메뉴 링크 클릭 시 메뉴 닫기
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('no-scroll'); 
                
                // 메뉴를 닫을 때 아이콘을 'X'에서 'bars'로 되돌립니다.
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // ---------------------------------------------------------
    // 3. Contact Form Submission (문의하기 폼)
    // (기존 코드 유지)
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // ... (폼 전송 로직) ...
            
            const subjectInput = contactForm.querySelector('input[name="_subject"]');
            const subjectValue = subjectInput ? subjectInput.value : '';
            const isEnglish = subjectValue.includes('(EN)');
            const isChinese = subjectValue.includes('(ZH)');

            let loadingMessage;
            if (isEnglish) {
                loadingMessage = 'Sending message...';
            } else if (isChinese) {
                loadingMessage = '正在发送消息...';
            } else {
                loadingMessage = '메시지를 전송 중입니다...';
            }
            formStatus.textContent = loadingMessage;

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
                    let successMessage;
                    if (isEnglish) {
                        successMessage = 'Your message has been successfully sent.<br>We will contact you shortly.'; 
                    } else if (isChinese) {
                        successMessage = '消息已成功发送。<br>我们会尽快与您联系。'; 
                    } else {
                        successMessage = '메시지가 성공적으로 전송되었습니다.<br>곧 연락드리겠습니다.';
                    }
                    formStatus.innerHTML = successMessage;
                    
                    contactForm.reset();
                    // 성공 메시지 잠시 후 사라지도록 설정
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 5000);
                } else {
                    const data = await response.json();
                    let failureMessage;

                    if (data.error) {
                        const errorMessage = `Submission failed: ${data.error}`;
                        if (isEnglish) {
                            failureMessage = errorMessage;
                        } else if (isChinese) {
                            failureMessage = `发送失败: ${data.error}`;
                        } else {
                            failureMessage = `전송 실패: ${data.error}`;
                        }
                        formStatus.textContent = failureMessage;
                    } else {
                        if (isEnglish) {
                            failureMessage = 'Message sending failed.<br>Please send us an email directly.';
                        } else if (isChinese) {
                            failureMessage = '消息发送失败。<br>请直接发送电子邮件给我们。';
                        } else {
                            failureMessage = '메시지 전송에 실패했습니다.<br>이메일로 직접 보내주세요.';
                        }
                        formStatus.innerHTML = failureMessage;
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
                let errorMessage;
                if (isEnglish) {
                    errorMessage = 'Could not communicate with the server.<br>Please try again shortly.';
                } else if (isChinese) {
                    errorMessage = '无法连接到服务器。<br>请稍后再试。';
                } else {
                    errorMessage = '서버와 통신할 수 없습니다.<br>잠시 후 다시 시도해 주세요.';
                }
                formStatus.innerHTML = errorMessage;
            }
        });
    }
});
