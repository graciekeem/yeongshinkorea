/*
 * Yeongshin Korea Custom Scripts
 * Version: 1.8 (수정된 Contact Form 로직 반영)
 */

// -----------------------------------------------------------------
// 5. 언어 전환 시 현재 탭 상태 유지를 위한 함수 (전역)
// -----------------------------------------------------------------
function updateLanguageSwitchers() {
    const langLinks = document.querySelectorAll('.language-switcher a');
    const path = window.location.pathname;
    
    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    const pageFolder = pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : null;

    const isTabbedPage = pageFolder === 'products' || pageFolder === 'buyers';
    if (!isTabbedPage) return;

    let activeTabId = null;
    const activeTabButton = document.querySelector('.tab-buttons .tab-button.active');
    
    if (activeTabButton) {
        activeTabId = activeTabButton.getAttribute('data-tab');
    }

    if (activeTabId) {
        langLinks.forEach(link => {
            let targetUrl = link.getAttribute('href');
            targetUrl = targetUrl.split('?')[0]; 
            targetUrl += `?tab=${activeTabId}`;
            link.setAttribute('href', targetUrl);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 네비게이션 및 모바일 메뉴
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            const icon = menuToggle.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        mobileMenu.querySelectorAll('a').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                body.classList.remove('no-scroll');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. Intersection Observer (애니메이션)
    const fadeInElements = document.querySelectorAll('.fade-in:not(.is-visible)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (!entry.target.closest('.tab-content')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });

    fadeInElements.forEach(el => observer.observe(el));

    // 갤러리 페이드인 처리 함수
    window.handleGalleryFadeIn = (container) => { 
        const items = container.querySelectorAll('.fade-in');
        items.forEach((item, index) => {
            item.classList.remove('is-visible');
            void item.offsetWidth; 
            setTimeout(() => {
                item.classList.add('is-visible');
            }, 50 * index); 
        });
    }

    // 3. Buyers 페이지 탭 로직
    const buyersContent = document.getElementById('buyers-content');
    if (buyersContent && body.classList.contains('buyers-page')) { 
        const tabButtons = buyersContent.querySelectorAll('.tab-button');
        const tabContents = buyersContent.querySelectorAll('.tab-content');

        const switchBuyerTab = (targetTabId) => {
            tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTabId));
            tabContents.forEach(content => {
                const isActive = content.id === targetTabId;
                content.classList.toggle('active', isActive);
                if (isActive) window.handleGalleryFadeIn(content);
            });
            updateLanguageSwitchers();
        };

        tabButtons.forEach(button => {
            button.addEventListener('click', () => switchBuyerTab(button.getAttribute('data-tab')));
        });
        
        const urlParams = new URLSearchParams(window.location.search);
        const initialTabId = urlParams.get('tab') || 'tab-drink';
        switchBuyerTab(document.getElementById(initialTabId) ? initialTabId : 'tab-drink');
    }

    // 4. Contact Form (요청하신 최신 로직 반영)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    const languageMessages = {
        ko: {
            sending: '메시지를 보내는 중입니다...',
            success: '문의 메시지가 성공적으로 전송되었습니다!',
            failure: '메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            error: '네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.'
        },
        en: {
            sending: 'Sending your message...',
            success: 'Your inquiry message has been sent successfully!',
            failure: 'Failed to send message. Please try again shortly.',
            error: 'A network error occurred. Please try again later.'
        },
        zh: {
            sending: '正在发送您的消息...',
            success: '您的咨询信息已成功发送！',
            failure: '消息发送失败。请稍后再试。',
            error: '发生网络错误。请稍后重试。'
        }
    };

    if (contactForm && formStatus) {
        const currentLang = (document.documentElement.lang || 'ko').toLowerCase().split('-')[0];
        const currentMessages = languageMessages[currentLang] || languageMessages.ko;

        const emailLocal = document.getElementById('email_local');
        const emailDomainSelect = document.getElementById('email_domain_select');
        const emailDomainManual = document.getElementById('email_domain_manual');
        const finalEmail = document.getElementById('final_email');

        emailDomainSelect.addEventListener('change', function () {
            if (this.value === 'self') {
                emailDomainManual.style.display = 'block';
                emailDomainManual.setAttribute('required', 'required');
                emailDomainManual.focus();
            } else {
                emailDomainManual.style.display = 'none';
                emailDomainManual.removeAttribute('required');
            }
        });

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            let domain = emailDomainSelect.value === 'self' ? emailDomainManual.value : emailDomainSelect.value;

            if (!emailLocal.value || !domain) {
                formStatus.innerHTML = `❌ ${
                    currentLang === 'ko'
                        ? '이메일 주소를 올바르게 입력해 주세요.'
                        : currentLang === 'en'
                        ? 'Please enter a valid email address.'
                        : '请输入正确的电子邮件地址。'
                }`;
                formStatus.style.color = 'red';
                return;
            }

            finalEmail.value = `${emailLocal.value}@${domain}`;
            const formData = new FormData(contactForm);

            formStatus.innerHTML = currentMessages.sending;
            formStatus.style.color = '#182c6b';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                window.dataLayer = window.dataLayer || [];

                if (response.ok) {
                    formStatus.innerHTML = currentMessages.success;
                    formStatus.style.color = 'green';
                    window.dataLayer.push({ event: 'form_submit_success' });
                    contactForm.reset();
                    emailDomainManual.style.display = 'none';
                    emailDomainSelect.value = '';
                } else {
                    formStatus.innerHTML = currentMessages.failure;
                    formStatus.style.color = 'red';
                    window.dataLayer.push({ event: 'form_submit_failure' });
                }
            } catch (error) {
                formStatus.innerHTML = currentMessages.error;
                formStatus.style.color = 'red';
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({ event: 'form_submit_error' });
            }
        });
    }

    setTimeout(updateLanguageSwitchers, 100); 
});
