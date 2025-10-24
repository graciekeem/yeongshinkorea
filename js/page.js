/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 2.1 (Products 탭 전환 및 배경 경로 수정)
 * Last Updated: 2025-10-24
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // pageTitleElement는 Products 페이지 배경 변경에 사용
    const pageTitleElement = document.getElementById('pageTitle');

    // -----------------------------------------------------------------
    // 참고: handleGalleryFadeIn 함수는 script.js 파일에서 전역으로 정의되어 있으므로 여기서는 제거합니다.
    // -----------------------------------------------------------------

    // -----------------------------------------------------------------
    // 1. Products 페이지 (수입 품목) 로직
    // -----------------------------------------------------------------
    const productsContent = document.getElementById('products-content');
    
    // Products 페이지에만 적용되는 배경 이미지 맵
    const PRODUCT_BACKGROUND_MAP = {
        'juice': 'images/background/products-hero-juice.png',
        'egg': 'images/background/products-hero-egg.png',
        'sugar': 'images/background/products-hero-sugar.png',
        'other': 'images/background/products-hero-other.png'
    };

    // body에 products-page 클래스가 있을 때만 실행 (products.html)
    if (productsContent && pageTitleElement && document.body.classList.contains('products-page')) {
        const tabButtons = productsContent.querySelectorAll('.tab-button');
        const tabContents = productsContent.querySelectorAll('.tab-content');

        const updateProductHeroBackground = (tabId) => {
            const bgUrl = PRODUCT_BACKGROUND_MAP[tabId];
            
            if (bgUrl) {
                // 현재 HTML 파일의 'lang' 속성을 확인하여 경로에 '../'를 추가할지 결정
                const currentLang = document.documentElement.getAttribute('lang');
                
                // lang='ko'가 아닐 경우 (예: 'en', 'zh') 상위 경로 '../'를 추가합니다.
                const isSubfolder = currentLang !== 'ko';
                
                // finalBgUrl이 'images/...'로 시작한다고 가정하고 경로를 설정합니다.
                const finalBgUrl = isSubfolder ? `../${bgUrl}` : bgUrl;
                
                pageTitleElement.style.backgroundImage = `url('${finalBgUrl}')`;
            }
        };

        // 탭 전환 로직 (스크롤 방지 기능 포함)
        const switchTab = (targetTabId, preventScroll = false) => {
            // 1. 버튼 활성화/비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const targetButton = document.querySelector(`#products-content .tab-button[data-tab="${targetTabId}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }

            // 2. 콘텐츠 표시/숨김 및 갤러리 애니메이션 재시작
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // ⚠️ script.js에서 정의된 전역 함수 사용
                if (typeof handleGalleryFadeIn === 'function') {
                    handleGalleryFadeIn(targetContent); 
                }
            }
            
            // 3. 배경 이미지 변경
            updateProductHeroBackground(targetTabId);

            // 4. URL 업데이트 (선택적)
            if (!preventScroll) {
                // history.pushState(null, null, `?tab=${targetTabId}`); 
            }
        };

        // 탭 클릭 이벤트 리스너
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');
                switchTab(targetTabId, false); // 버튼 클릭 시 스크롤 방지 옵션 사용 안 함
            });
        });

        // URL 파라미터 기반 초기 탭 설정
        const urlParams = new URLSearchParams(window.location.search);
        const initialTabId = urlParams.get('tab');
        
        let defaultTabId = 'juice'; // products.html의 기본 탭 ID

        if (initialTabId && PRODUCT_BACKGROUND_MAP[initialTabId]) {
            defaultTabId = initialTabId;
        }
        
        // 초기 탭 설정 시 자동 스크롤 방지를 위해 switchTab()을 직접 실행하고 preventScroll=true 설정
        switchTab(defaultTabId, true); 
    }
});
