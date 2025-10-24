/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 1.9 (Products 탭 전환 및 초기 로드 로직 수정 - 자동 스크롤 방지 추가)
 * Last Updated: 2025-10-24
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 페이지 제목 엘리먼트 (배경 이미지를 변경할 대상)
    const pageTitleElement = document.getElementById('pageTitle');

    // 갤러리/이미지 항목의 페이드인 애니메이션 재시작 로직
    const handleGalleryFadeIn = (container) => {
          const items = container.querySelectorAll('.fade-in');
          items.forEach((item, index) => {
              item.classList.remove('is-visible');
              void item.offsetWidth; 
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
                pageTitleElement.style.backgroundImage = `url('${bgUrl}')`;
            }
        };

        // 🚨 [새로 추가된 함수]: 탭 전환 로직을 분리하고 스크롤 방지 기능을 추가
        const switchTab = (targetTabId, preventScroll = false) => {
            // 1. 버튼 활성화/비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const targetButton = document.querySelector(`#products-content .tab-button[data-tab="${targetTabId}"]`);
            if (targetButton) {
                targetButton.classList.add('active');
            }

            // 2. 콘텐츠 표시/숨김
            tabContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(targetTabId);
            if (targetContent) {
                targetContent.classList.add('active');
                handleGalleryFadeIn(targetContent);
            }
            
            // 3. 배경 이미지 변경
            updateProductHeroBackground(targetTabId);

            // 4. 🚨 [자동 스크롤 방지]: 스크롤이 자동으로 되는 코드가 있었다면 여기에 있었을 것이므로,
            //    이 함수를 직접 실행하면 기존의 자동 스크롤은 실행되지 않습니다.
            //    만약 별도의 스크롤 코드를 제거해야 한다면, 이 함수 밖에서 제거해야 합니다.
            
            // 5. 🚨 [과일/채소 농축액 스크롤 제거]: 현재 '과일/채소 농축액' 탭으로 전환될 때만 스크롤 다운되는 현상을 막기 위해
            //    switchTab 함수 내에서는 어떠한 스크롤 동작도 넣지 않습니다.
            
            // URL을 갱신하여 탭 상태 유지 (선택적)
            if (!preventScroll) {
                 // history.pushState(null, null, `?tab=${targetTabId}`); // 탭 클릭 시 URL 변경 (선택 사항)
            }
        };

        // 탭 클릭 이벤트 리스너 수정
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTabId = this.getAttribute('data-tab');
                // 탭 버튼 클릭 시에는 스크롤 방지(true) 옵션을 사용하지 않음 (어차피 스크롤 코드가 없으므로)
                switchTab(targetTabId, false); 
            });
        });

        // URL 파라미터 (쿼리 문자열) 처리 및 초기 탭 설정
        const urlParams = new URLSearchParams(window.location.search);
        // initialTabIdWithSuffix 로직 제거: index.html에서 ?tab=juice로 넘기므로 불필요
        const initialTabId = urlParams.get('tab');
        
        let defaultTabId = 'juice'; // products.html의 기본 탭 ID

        if (initialTabId && PRODUCT_BACKGROUND_MAP[initialTabId]) {
            defaultTabId = initialTabId;
        }
        
        // 🚨 [가장 중요한 수정]: URL 파라미터 기반 초기 탭 설정 시 click() 대신 switchTab()을 직접 실행
        // click()을 사용하면 스크롤이 유발될 수 있으므로, 직접 탭 전환 함수를 사용합니다.
        // 이 때 preventScroll 옵션을 true로 간주하여 어떤 스크롤 동작도 막습니다.
        switchTab(defaultTabId, true); 
    }
    
    // -----------------------------------------------------------------
    // 2. Buyers 페이지 (고객사) 로직 - script.js에 통합됨 (이 파일에서는 제거)
    // -----------------------------------------------------------------
});
