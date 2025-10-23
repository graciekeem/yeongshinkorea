/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 1.6 (Products/Buyers 페이지 로직 - Buyers 배경 고정)
 * Last Updated: 2025-10-23
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 페이지 제목 엘리먼트 (배경 이미지를 변경할 대상)
    const pageTitleElement = document.getElementById('pageTitle');

    // 갤러리/이미지 항목의 페이드인 애니메이션 재시작 로직
    const handleGalleryFadeIn = (container) => {
         const items = container.querySelectorAll('.fade-in');
         items.forEach((item, index) => {
             // is-visible 제거 후 강제 리플로우를 통해 애니메이션 초기화
             item.classList.remove('is-visible');
             void item.offsetWidth; 
             // 짧은 지연시간을 두어 순차적으로 나타나게 함 (CSS의 delay-x 클래스에 의해 관리됨)
             setTimeout(() => {
                 item.classList.add('is-visible');
             }, 50 * index); 
         });
    }

    // -----------------------------------------------------------------
    // 1. Products 페이지 (수입 품목) 로직
    // -----------------------------------------------------------------
    const productsContent = document.getElementById('products-content');
    
    // Products 페이지에만 적용되는 배경 이미지 맵
    const PRODUCT_BACKGROUND_MAP = {
        'juice': 'images/background/fruit-concentrate-hero.png',
        'egg': 'images/background/products-hero-egg.png',
        'sugar': 'images/background/products-hero-sugar.png',
        'other': 'images/background/products-hero-other.png'
    };

    if (productsContent && pageTitleElement) {
        const tabButtons = productsContent.querySelectorAll('.tab-button');
        const tabContents = productsContent.querySelectorAll('.tab-content');

        const updateProductHeroBackground = (tabId) => {
            const bgUrl = PRODUCT_BACKGROUND_MAP[tabId];
            if (bgUrl) {
                pageTitleElement.style.backgroundImage = `url('${bgUrl}')`;
            }
        };
        
        // 탭 클릭 이벤트 리스너 추가
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');

                // 1. 버튼 활성화/비활성화
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 2. 콘텐츠 표시/숨김
                tabContents.forEach(content => content.classList.remove('active'));
                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    handleGalleryFadeIn(targetContent);
                }
                
                // 3. 배경 이미지 변경 (Products 로직)
                // 현재 active 상태인 탭의 배경 이미지로 변경
                updateProductHeroBackground(targetTabId);
                
                // Buyers 페이지 탭 전환 시 Products 배경이 유지되도록 함
                // (Buyers 페이지에서는 이 로직 자체가 실행되지 않음)
            });
        });

        // URL 파라미터 (쿼리 문자열) 처리
        const urlParams = new URLSearchParams(window.location.search);
        const initialTabIdWithSuffix = urlParams.get('tab'); 
        const initialTabId = initialTabIdWithSuffix ? initialTabIdWithSuffix.replace('-tab', '') : null;
        
        let defaultTabId = 'juice'; // 기본값

        if (initialTabId && PRODUCT_BACKGROUND_MAP[initialTabId]) {
            defaultTabId = initialTabId;
            const targetButton = document.querySelector(`#products-content .tab-button[data-tab="${initialTabId}"]`);
            if (targetButton) {
                targetButton.click();
                return; 
            }
        }
        
        // 초기 탭 설정 및 배경 설정
        updateProductHeroBackground(defaultTabId);
        const activeContent = document.getElementById(defaultTabId);
        if (activeContent) {
            handleGalleryFadeIn(activeContent);
        }
    }


    // -----------------------------------------------------------------
    // 2. Buyers 페이지 (고객사) 로직 - 배경 이미지 변경 기능 제거
    // -----------------------------------------------------------------
    const buyersContent = document.getElementById('buyers-content');

    if (buyersContent && pageTitleElement) {
        const tabButtons = buyersContent.querySelectorAll('.tab-button');
        const tabContents = buyersContent.querySelectorAll('.tab-content');

        // 탭 클릭 이벤트 리스너 추가
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');

                // 1. 버튼 활성화/비활성화
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // 2. 콘텐츠 표시/숨김
                tabContents.forEach(content => content.classList.remove('active'));
                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                    handleGalleryFadeIn(targetContent);
                }
                
                // 3. 배경 이미지 변경 로직은 실행하지 않음 (고정)
            });
        });
        
        // 초기 활성화된 탭의 갤러리 애니메이션만 실행 (배경 고정)
        const activeContent = document.querySelector('#buyers-content .tab-content.active');
        if (activeContent) {
            handleGalleryFadeIn(activeContent);
        }
    }
});
