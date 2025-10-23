/*
 * Yeongshin Korea Custom Scripts
 * Version: 1.4 (최종 통합 및 안정화)
 * Last Updated: 2025-10-23
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 1. 네비게이션 및 모바일 메뉴 토글
    // ===========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            // 모바일 메뉴 활성화/비활성화
            mobileMenu.classList.toggle('active');
            
            // 본문 스크롤 잠금 (모바일 메뉴가 열렸을 때만)
            body.classList.toggle('no-scroll');
            
            // 햄버거 아이콘 변경
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // X 아이콘으로 변경
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // 햄버거 아이콘으로 복귀
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // 모바일 메뉴 항목 클릭 시 메뉴 닫기
        mobileMenu.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ===========================================
    // 2. 스크롤 기반 요소 페이드인 애니메이션 (Intersection Observer)
    // ===========================================
    const fadeInElements = document.querySelectorAll('.fade-in:not(.is-visible)');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // CSS에서 transition-delay 클래스(delay-1, delay-2 등)를 사용하여 지연 처리
                element.classList.add('is-visible');
                
                // 한 번 실행된 후 관찰 중단
                // 단, products/buyers 페이지의 탭 내부 요소는 탭 전환 시 재활성화되어야 하므로 제외
                if (!element.closest('.tab-content')) {
                    observer.unobserve(element);
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // 요소의 10%가 보일 때 애니메이션 시작
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });


    // ===========================================
    // 3. 탭 기능 처리 (buyers.html)
    // ===========================================
    const tabButtons = document.querySelectorAll('#buyers-content .tab-button');
    const tabContents = document.querySelectorAll('#buyers-content .tab-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');

                // 모든 버튼에서 active 클래스 제거
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // 클릭된 버튼에 active 클래스 추가
                this.classList.add('active');

                // 모든 콘텐츠 숨기기
                tabContents.forEach(content => content.classList.remove('active'));

                // 타겟 콘텐츠 보이기
                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // 탭 전환 시 갤러리 애니메이션 재시작
                    targetContent.querySelectorAll('.fade-in').forEach(item => {
                        item.classList.remove('is-visible');
                        void item.offsetWidth; // 강제 리플로우
                        item.classList.add('is-visible');
                    });
                }
            });
        });
    }

    // ===========================================
    // 4. Contact Form (contact.html)
    // ===========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            formStatus.textContent = '메시지를 보내는 중입니다...';
            formStatus.style.color = '#182c6b';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = '✅ 메시지가 성공적으로 전송되었습니다! 곧 답변 드리겠습니다.';
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    formStatus.textContent = '❌ 메시지 전송에 실패했습니다. 이메일로 직접 연락 부탁드립니다.';
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                formStatus.textContent = '❌ 네트워크 오류가 발생했습니다. 이메일로 직접 연락 부탁드립니다.';
                formStatus.style.color = 'red';
            }
        });
    }

}); // DOMContentLoaded end
