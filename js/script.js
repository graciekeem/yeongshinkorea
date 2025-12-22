/*
 * Yeongshin Korea Custom Scripts
 * Version: 1.8 (기존 변수명 및 GTM 로직 완전 유지)
 * Last Updated: 2025-10-24
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
    
    // 현재 페이지의 언어 코드를 확인합니다 (ko, en, zh)
    const getLanguage = () => {
        const lang = document.documentElement.getAttribute('lang') || 'ko';
        return lang.split('-')[0].toLowerCase();
    };

    const lang = getLanguage();

    // 🚨 기존 MESSAGES 객체 구조 유지
    const MESSAGES = {
        ko: {
            sending: '메시지를 보내는 중입니다...',
            success: '메시지가 성공적으로 전송되었습니다!<br>곧 답변 드리겠습니다.',
            failure: '메시지 전송에 실패했습니다.<br>잠시 후에 다시 시도해주시기 바랍니다.',
            error: '네트워크 오류가 발생했습니다.<br>잠시 후에 다시 시도해주시기 바랍니다.'
        },
        en: {
            sending: 'Sending message...',
            success: 'Message sent successfully! <br>We will get back to you shortly.',
            failure: 'We are sorry, your message could not be sent.<br>Please kindly try again shortly.',
            error: 'A temporary network error has occurred.<br>We apologize for the inconvenience and ask that you please try again later.'
        },
        zh: {
            sending: '正在发送消息...',
            success: '消息已成功发送！<br>我们将尽快给您答复。',
            failure: '抱歉，消息发送失败。<br>请您稍后再试。',
            error: '发生了暂时性的网络错误。<br>对此造成的不便深表歉意，请您稍后重试。'
        }
    };

    // 🚨 질문하신 변수명 그대로 사용
    const currentMessages = MESSAGES[lang] || MESSAGES.ko;

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

    // 2. Intersection Observer
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

    // 3. Buyers 페이지 탭
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

    // 4. Contact Form (GTM 및 변수명 유지)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        const emailLocal = document.getElementById('email_local');
        const emailDomainSelect = document.getElementById('email_domain_select');
        const emailDomainManual = document.getElementById('email_domain_manual');
        const finalEmail = document.getElementById('final_email');
        
        emailDomainSelect.addEventListener('change', function() {
            const isSelf = this.value === 'self';
            emailDomainManual.style.display = isSelf ? 'block' : 'none';
            if (isSelf) {
                emailDomainManual.setAttribute('required', 'required');
                emailDomainManual.focus();
            } else {
                emailDomainManual.removeAttribute('required');
            }
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let domain = emailDomainSelect.value === 'self' ? emailDomainManual.value : emailDomainSelect.value;
            
            if (!emailLocal.value || !domain) {
                formStatus.innerHTML = `❌ ${lang === 'ko' ? '이메일 주소를 올바르게 입력해 주세요.' : lang === 'en' ? 'Please enter a valid email address.' : '请输入正确的电子邮件地址。'}`;
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
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.innerHTML = currentMessages.success; // 👈 여기 유지됨
                    formStatus.style.color = 'green';
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: 'form_submit_success' });
                    contactForm.reset();
                    emailDomainManual.style.display = 'none';
                    emailDomainSelect.value = '';
                } else {
                    formStatus.innerHTML = currentMessages.failure; 
                    formStatus.style.color = 'red';
                    window.dataLayer = window.dataLayer || [];
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
