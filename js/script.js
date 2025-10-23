document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // 헤더 높이 계산 및 CSS 변수 설정
    const headerHeight = navbar ? navbar.offsetHeight : 80; // 헤더 높이 계산 (기본값 80)
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    // ==========================================================
    // 1. 헤더 메뉴 토글 (모바일)
    // ==========================================================
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            // [확인]: CSS의 .mobile-menu.active와 연동되어 작동합니다.
            mobileMenu.classList.toggle('active');
            
            // 아이콘 전환
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // ==========================================================
    // 2. 스크롤 애니메이션 (Fade-in on scroll)
    // ==========================================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10%가 보이면 애니메이션 시작
    };

    function checkVisibility(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (!entry.target.closest('.tab-content')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }

    const observer = new IntersectionObserver(checkVisibility, observerOptions);

    fadeElements.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('is-visible');
        } else {
            observer.observe(element);
        }
    });

// =========================================================
// 3. 탭 전환 기능 (Tab Switching) 및 배경 이미지 변경 로직
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const heroTitle = document.querySelector('.page-hero-title');

    // 탭 클릭 이벤트 핸들러
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTabId = this.getAttribute('data-tab');

            // 1. 버튼 활성화/비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // 2. 콘텐츠 표시/숨김
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTabId) {
                    content.classList.add('active');
                    // 3. 탭 전환 시 애니메이션 재시작 (갤러리 항목)
                    handleGalleryFadeIn(content); 
                }
            });

            // 4. 상단 배경 이미지 변경 (핵심 복구 로직)
            // data-image 속성에서 이미지 경로를 가져옵니다. (HTML에 추가 필요)
            const newImage = this.getAttribute('data-image');
            if (heroTitle && newImage) {
                // background-image 스타일 속성만 변경
                heroTitle.style.backgroundImage = `url('${newImage}')`;
            }
        });
    });

    // 갤러리/이미지 항목의 페이드인 애니메이션 로직 (별도로 있어야 함)
    function handleGalleryFadeIn(container) {
        const items = container.querySelectorAll('.fade-in:not(.is-visible)');
        items.forEach((item, index) => {
            // is-visible을 제거하고 다시 추가하여 애니메이션을 강제 재시작
            item.classList.remove('is-visible'); 
            setTimeout(() => {
                item.classList.add('is-visible');
            }, 50 * index); // 짧은 지연시간을 두어 순차적으로 나타나게 함
        });
    }
    
    // 페이지 로드 시 초기 활성화 탭의 갤러리 애니메이션 실행
    const activeContent = document.querySelector('.tab-content.active');
    if (activeContent) {
        handleGalleryFadeIn(activeContent);
    }
});

    // ==========================================================
    // 4. URL 쿼리(Query)를 확인하여 특정 탭 자동 활성화 (products.html 전용)
    // ==========================================================
    function activateTabFromUrlQuery() {
        if (!document.querySelector('.tab-buttons')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const tabId = urlParams.get('tab'); 

        if (tabId) {
            const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
            
            if (targetButton) {
                targetButton.click(); 
            } else {
                console.warn(`URL에 지정된 탭 ID (${tabId})를 가진 버튼을 찾을 수 없습니다.`);
            }
        }
    }

    activateTabFromUrlQuery(); 

});
