/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 1.5 (Products/Buyers 페이지 로직 통합)
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

    // ===========================================
    // 1. Products 페이지 (수입 품목) 로직
    // ===========================================
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
                
                // 3. 배경 이미지 변경
                updateProductHeroBackground(targetTabId);
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


    // ===========================================
    // 2. Buyers 페이지 (고객사) 로직
    // ===========================================
    const buyersContent = document.getElementById('buyers-content');

    // Buyers 페이지에만 적용되는 배경 이미지 맵 (추가된 핵심 로직)
    const BUYER_BACKGROUND_MAP = {
        'food': 'images/background/buyers-hero-food.png',
        'dairy': 'images/background/buyers-hero-dairy.png',
        'beverage': 'images/background/buyers-hero-beverage.png',
        'other-buyers': 'images/background/buyers-hero-other.png' 
    };

    if (buyersContent && pageTitleElement) {
        const tabButtons = buyersContent.querySelectorAll('.tab-button');
        const tabContents = buyersContent.querySelectorAll('.tab-content');

        const updateBuyerHeroBackground = (tabId) => {
            const bgUrl = BUYER_BACKGROUND_MAP[tabId];
            if (bgUrl) {
                // 부드러운 전환을 위해 CSS에 정의된 transition 속성을 사용
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
                
                // 3. 배경 이미지 변경 (Buyers 로직)
                updateBuyerHeroBackground(targetTabId);
            });
        });
        
        // 페이지 로드 시 초기 'food' 탭의 배경 설정
        updateBuyerHeroBackground('food');
        const activeContent = document.getElementById('food');
        if (activeContent) {
            handleGalleryFadeIn(activeContent);
        }
    }
});
