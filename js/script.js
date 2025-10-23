document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const languageSwitcher = document.querySelector('.language-switcher');
    
    const headerHeight = navbar ? navbar.offsetHeight : 0;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);

    // ==========================================================
    // 1. 헤더 메뉴 토글 (모바일)
    // ==========================================================
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
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
                // 애니메이션이 한 번 실행된 후에는 관찰을 중단합니다.
                // 탭 콘텐츠 내부 요소는 탭 전환 시 다시 관찰해야 하므로, 제외합니다.
                if (!entry.target.closest('.tab-content')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }

    const observer = new IntersectionObserver(checkVisibility, observerOptions);

    fadeElements.forEach(element => {
        // 이미 보이는 요소 (예: 페이지 상단)는 즉시 is-visible을 적용합니다.
        if (element.getBoundingClientRect().top < window.innerHeight) {
            element.classList.add('is-visible');
        } else {
            observer.observe(element);
        }
    });

    // ==========================================================
    // 3. 제품 카테고리 탭 기능 (products.html)
    // ==========================================================
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const heroSection = document.getElementById('pageTitle'); // 제품 페이지 상단 Hero 섹션

    function handleTabClick(event) {
        const targetButton = event.currentTarget;
        const tabId = targetButton.dataset.tab;
        const newBg = targetButton.dataset.heroBg;

        // 1. 버튼 상태 업데이트
        tabButtons.forEach(btn => btn.classList.remove('active'));
        targetButton.classList.add('active');

        // 2. 콘텐츠 전환
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        const newTab = document.getElementById(tabId);
        if (newTab) {
            newTab.classList.add('active');
        }

        // 3. 배경 이미지 변경 (선택 사항 - heroSection이 존재할 경우)
        if (heroSection && newBg) {
            heroSection.style.backgroundImage = `url(${newBg})`;
        }


        // 4. [핵심 수정]: 탭 전환 시 콘텐츠 애니메이션 재시작
        if (newTab) {
            // 새로 활성화된 탭 내부의 모든 애니메이션 요소를 찾습니다.
            const animatedElements = newTab.querySelectorAll('.fade-in');
            
            // Intersection Observer에게 다시 관찰하도록 지시할 필요가 없습니다.
            // 대신, CSS 트랜지션을 강제로 리셋하여 애니메이션을 재실행합니다.

            animatedElements.forEach(element => {
                // 1. 기존의 애니메이션 완료 상태(is-visible)를 제거하여 초기화합니다.
                element.classList.remove('is-visible'); 
                
                // 2. 강제로 DOM 리플로우를 발생시켜 CSS 트랜지션을 리셋합니다.
                //    (브라우저가 변경 사항을 인식하도록 하여 애니메이션이 처음부터 시작되게 합니다.)
                void element.offsetWidth; 

                // 3. 잠시 후 is-visible 클래스를 다시 추가하여 애니메이션을 재시작합니다.
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, 50); // 50ms의 짧은 지연 시간
            });

            // 스크롤 위치를 탭 콘텐츠 시작 지점으로 부드럽게 이동합니다.
            document.getElementById('products-content').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });


    // ==========================================================
    // 4. 고객사 갤러리 애니메이션 (buyers.html)
    // ==========================================================
    // products.html의 탭 콘텐츠와 유사하게 처리됨.
    // clients.html에서는 스크롤 애니메이션(2번 섹션)에 의존합니다.

});
