/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 1.4 (Products/About 페이지 로직)
 * Last Updated: 2025-10-23
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // 1. Products 페이지 (수입 품목) 로직
    // ===========================================
    const pageTitleElement = document.getElementById('pageTitle');
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
                // 부드러운 전환을 위해 transition 속성을 사용 (CSS에 정의됨)
                pageTitleElement.style.backgroundImage = `url('${bgUrl}')`;
            }
        };
        
        const handleGalleryFadeIn = (container) => {
             // 탭 전환 시 갤러리 애니메이션 재시작 로직
             const items = container.querySelectorAll('.fade-in');
             items.forEach((item, index) => {
                 item.classList.remove('is-visible');
                 // 짧은 지연시간을 두어 순차적으로 나타나게 함 (CSS의 delay-x 클래스에 의해 관리됨)
                 // 강제 리플로우를 위해 짧은 지연 후 클래스 추가
                 setTimeout(() => {
                     item.classList.add('is-visible');
                 }, 50 * index); 
             });
        }


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
        // index.html에서 넘어올 때는 products.html?tab=juice-tab 와 같이 -tab을 붙여서 넘어옵니다.
        const initialTabIdWithSuffix = urlParams.get('tab'); 
        const initialTabId = initialTabIdWithSuffix ? initialTabIdWithSuffix.replace('-tab', '') : null;
        
        let defaultTabId = 'juice'; // 기본값

        if (initialTabId && PRODUCT_BACKGROUND_MAP[initialTabId]) {
            defaultTabId = initialTabId;
            const targetButton = document.querySelector(`.tab-button[data-tab="${initialTabId}"]`);
            if (targetButton) {
                targetButton.click(); // 해당 탭 클릭 이벤트 실행 (배경 및 콘텐츠 활성화 자동 처리)
                return; // URL 처리 후 함수 종료
            }
        }
        
        // URL 파라미터가 없거나 유효하지 않은 경우, 초기 'juice' 탭의 배경을 설정
        updateProductHeroBackground(defaultTabId);
        // 초기 활성화된 탭의 갤러리 애니메이션도 실행
        const activeContent = document.getElementById(defaultTabId);
        if (activeContent) {
            handleGalleryFadeIn(activeContent);
        }
    }
    
});
