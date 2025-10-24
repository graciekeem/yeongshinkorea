/*
 * Yeongshin Korea Custom Scripts
 * Version: 1.7 (언어 전환 탭 유지 로직 최종 수정)
 * Last Updated: 2025-10-24
 */

// -----------------------------------------------------------------
// 5. 언어 전환 시 현재 탭 상태 유지를 위한 함수 (전역으로 분리)
// -----------------------------------------------------------------
function updateLanguageSwitchers() {
    const langLinks = document.querySelectorAll('.language-switcher a');
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1); // products.html or buyers.html

    // 탭이 있는 페이지인지 확인
    const isTabbedPage = currentPage === 'products.html' || currentPage === 'buyers.html';
    if (!isTabbedPage) return;

    // 현재 활성화된 탭의 ID를 찾습니다.
    let activeTabId = null;
    const activeTabButton = document.querySelector('.tab-buttons .tab-button.active');
    
    if (activeTabButton) {
        activeTabId = activeTabButton.getAttribute('data-tab');
    }

    if (activeTabId) {
        langLinks.forEach(link => {
            let targetUrl = link.getAttribute('href');
            
            // 기존 쿼리스트링(tab=...)이 있다면 제거
            targetUrl = targetUrl.split('?')[0]; 
            
            // 새 탭 정보 추가
            targetUrl += `?tab=${activeTabId}`;
            
            // 업데이트된 URL을 적용
            link.setAttribute('href', targetUrl);
        });
    }
} // end updateLanguageSwitchers


document.addEventListener('DOMContentLoaded', function() {
    
    // 현재 페이지의 언어 코드를 확인합니다 (ko, en, zh)
    const getLanguage = () => {
        const lang = document.documentElement.getAttribute('lang') || 'ko';
        return lang.split('-')[0].toLowerCase();
    };

    const lang = getLanguage();

    // 언어별 메시지 정의
    const MESSAGES = {
        ko: {
            sending: '메시지를 보내는 중입니다...',
            success: '메시지가 성공적으로 전송되었습니다!   곧 답변 드리겠습니다.',
            failure: '메시지 전송에 실패했습니다.   잠시 후에 다시 시도해주시기 바랍니다.',
            error: '네트워크 오류가 발생했습니다.   잠시 후에 다시 시도해주시기 바랍니다.'
        },
        en: {
            sending: 'Sending message...',
            success: 'Message sent successfully! We will get back to you shortly.',
            failure: 'We are sorry, your message could not be sent. Please kindly try again shortly.',
            error: 'A temporary network error has occurred. We apologize for the inconvenience and ask that you please try again later.'
        },
        zh: { // 중국어 간체
            sending: '正在发送消息...',
            success: '消息已成功发送！我们将尽快给您答复。',
            failure: '抱歉，消息发送失败。请您稍后再试。',
            error: '发生了暂时性的网络错误。对此造成的不便深表歉意，请您稍后重试。'
        }
    };

    const currentMessages = MESSAGES[lang] || MESSAGES.ko; // 지원하지 않는 언어는 한국어로 대체

    // 갤러리/이미지 항목의 페이드인 애니메이션 재시작 로직 ( Buyers/Products 페이지 탭 전환용으로 필요)
    // *이 함수는 page.js에서도 사용해야 하므로 전역에 정의된 것으로 간주합니다.
    window.handleGalleryFadeIn = (container) => { 
        const items = container.querySelectorAll('.fade-in');
        items.forEach((item, index) => {
            item.classList.remove('is-visible');
            void item.offsetWidth; // 강제 리플로우
            setTimeout(() => {
                item.classList.add('is-visible');
            }, 50 * index); 
        });
    }

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
                
                element.classList.add('is-visible');
                
                // 탭 내부 요소는 탭 전환 시 재활성화되어야 하므로 제외
                if (!element.closest('.tab-content')) {
                    observer.unobserve(element);
                }
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 
    });

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // ===========================================
    // 3. Buyers 페이지 탭 기능 처리 (buyers.html)
    // ===========================================
    const buyersContent = document.getElementById('buyers-content');

    if (buyersContent && document.body.classList.contains('buyers-page')) { 
        const tabButtons = buyersContent.querySelectorAll('.tab-button');
        const tabContents = buyersContent.querySelectorAll('.tab-content');

        // 탭 전환을 처리하는 함수
        const switchBuyerTab = (targetTabId) => {
            // 1. 버튼 활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const targetButton = document.querySelector(`#buyers-content .tab-button[data-tab="${targetTabId}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }

            // 2. 콘텐츠 표시 및 갤러리 애니메이션 재시작
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 탭 전환 시 갤러리 애니메이션 재시작
                if (typeof window.handleGalleryFadeIn === 'function') {
                    window.handleGalleryFadeIn(targetContent);
                }
            }

            // 3. 🚨 추가: 탭 전환 직후 언어 스위처 URL 업데이트
            if (typeof updateLanguageSwitchers === 'function') {
                updateLanguageSwitchers();
            }
        };

        // 탭 클릭 이벤트 리스너
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');
                switchBuyerTab(targetTabId);
            });
        });
        
        // 페이지 로드 시 초기 탭 설정 (URL 파라미터 처리)
        const urlParams = new URLSearchParams(window.location.search);
        const initialTabId = urlParams.get('tab');
        
        let defaultTabId = 'tab-drink'; 
        
        if (initialTabId && document.getElementById(initialTabId)) {
            defaultTabId = initialTabId;
        }
        
        switchBuyerTab(defaultTabId);
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
            
            // 1. 메시지 '보내는 중' 표시
            formStatus.textContent = currentMessages.sending;
            formStatus.style.color = '#182c6b'; // 파란색 계열

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 2. 메시지 '성공' 표시
                    formStatus.textContent = currentMessages.success;
                    formStatus.style.color = 'green';
                    contactForm.reset();
                } else {
                    // 3. 메시지 '실패' 표시
                    formStatus.textContent = currentMessages.failure;
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                // 4. 메시지 '네트워크 오류' 표시
                formStatus.textContent = currentMessages.error;
                formStatus.style.color = 'red';
            }
        });
    }

    // -----------------------------------------------------------------
    // 페이지 로드 후 언어 전환 링크 업데이트 로직을 지연 실행
    // -----------------------------------------------------------------
    // Products/Buyers 페이지의 초기 탭 설정(URL 파라미터 처리)이 완료된 후 실행
    setTimeout(updateLanguageSwitchers, 800); 
    
}); // DOMContentLoaded end
