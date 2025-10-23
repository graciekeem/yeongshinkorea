document.addEventListener("DOMContentLoaded", function() {
    
    // ---------------------------------------------------------
    // 1. Fade-in & Intersecting Observer (스크롤 애니메이션)
    // ---------------------------------------------------------
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
    // 3. Product Tab Switching (수입 품목 탭 전환) <--- 이 부분이 핵심
    // ---------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageHeroTitle = document.querySelector('.page-hero-title'); 
    // const bgPath = '../images/background/'; // <-- 이 변수를 제거합니다.

    // 탭 전환 및 배경 이미지 변경 함수
    function changeProductTab(button) {
        // 1. 모든 버튼/콘텐츠에서 active 클래스 제거 (비활성화)
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // 2. 클릭된 버튼/콘텐츠에 active 클래스 추가 (활성화)
        button.classList.add('active');
        const targetTabId = button.getAttribute('data-tab');
        const targetContent = document.getElementById(targetTabId);

        if (targetContent) {
            targetContent.classList.add('active');
            
            // 3. [배경 이미지 변경 로직]: data-hero-bg 속성 값을 읽어 배경 변경
            const newBgImageFullUrl = button.getAttribute('data-hero-bg'); // 전체 경로를 읽음
            if (pageHeroTitle && newBgImageFullUrl) {
                // 검은색 오버레이(rgba(0,0,0,0.3))와 전체 경로를 사용
                pageHeroTitle.style.backgroundImage = 
                    `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${newBgImageFullUrl}')`; // <-- 경로 합치기 없이 바로 사용
            }

            // 4. 탭 전환 시 애니메이션 재적용 (observer가 정의되어 있다고 가정)
            if (typeof observer !== 'undefined') { 
                targetContent.querySelectorAll('.fade-in').forEach(el => {
                    el.classList.remove('is-visible'); 
                    observer.observe(el);
                });
            }
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => changeProductTab(button));
    });

    // 페이지 로드 시, 첫 번째 탭의 배경을 기본으로 설정
    const initialActiveButton = document.querySelector('.tab-button.active');
    if (initialActiveButton) {
        setTimeout(() => changeProductTab(initialActiveButton), 50); 
    }
    // ---------------------------------------------------------
    // 4. Contact Form Submission (문의하기 폼)
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
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
