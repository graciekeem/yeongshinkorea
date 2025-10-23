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
            mobileMenu.classList.toggle('active');
            // document.body.classList.toggle('no-scroll'); // 필요한 경우 스크롤 잠금 활성화
            
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
                // 탭 콘텐츠 내부 요소는 탭 전환 시 재활용해야 하므로, 스크롤 애니메이션 관찰을 중단하지 않습니다.
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


        // 4. 탭 전환 시 콘텐츠 애니메이션 재시작
        if (newTab) {
            const animatedElements = newTab.querySelectorAll('.fade-in');

            animatedElements.forEach(element => {
                element.classList.remove('is-visible'); 
                void element.offsetWidth; // 강제 리플로우
                setTimeout(() => {
                    element.classList.add('is-visible');
                }, 50); 
            });

            
            // 5. [수정 반영]: 스크롤 위치를 탭 콘텐츠 시작 지점으로 조정 (헤더 가림 방지)
            const targetElement = document.getElementById('products-content');
            if (targetElement) {
                
                // 고정 헤더 높이를 사용하여 스크롤 목표 위치를 계산합니다.
                const headerHeight = document.querySelector('.navbar').offsetHeight || 80;
                
                // targetElement의 뷰포트 상단 위치 + 현재 스크롤 위치 - 헤더 높이
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', handleTabClick);
    });


    // ==========================================================
    // 4. URL 쿼리(Query)를 확인하여 특정 탭 자동 활성화 (products.html 전용)
    // ==========================================================
    function activateTabFromUrlQuery() {
        // 현재 페이지가 products.html이 아니거나 탭 버튼이 없으면 종료
        if (!document.querySelector('.tab-buttons')) return;

        const urlParams = new URLSearchParams(window.location.search);
        const tabId = urlParams.get('tab'); // URL에서 '?tab=...' 값 가져오기

        if (tabId) {
            const targetButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
            
            if (targetButton) {
                // 버튼 클릭 이벤트를 강제로 실행하여 handleTabClick을 호출합니다.
                // 이로 인해 탭이 활성화되고, 스크롤 조정까지 자동으로 수행됩니다.
                targetButton.click(); 

            } else {
                console.warn(`URL에 지정된 탭 ID (${tabId})를 가진 버튼을 찾을 수 없습니다. 기본 탭이 활성화됩니다.`);
            }
        }
    }

    // DOMContentLoaded 시점에 탭 활성화 함수 실행
    activateTabFromUrlQuery(); 

});
