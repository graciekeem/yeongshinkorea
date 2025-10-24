/*
 * Yeongshin Korea Page Specific Scripts
 * Version: 1.7 (Products/Buyers 페이지 로직 - 최종 반영)
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
              // 강제 리플로우
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
        'juice': 'images/background/products-hero-juice.png', // 경로 수정됨
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

        // URL 파라미터 (쿼리 문자열) 처리 및 초기 탭 설정
        const urlParams = new URLSearchParams(window.location.search);
        const initialTabIdWithSuffix = urlParams.get('tab'); 
        const initialTabId = initialTabIdWithSuffix ? initialTabIdWithSuffix.replace('-tab', '') : null;
        
        let defaultTabId = 'juice'; // products.html의 기본 탭 ID

        if (initialTabId && PRODUCT_BACKGROUND_MAP[initialTabId]) {
            defaultTabId = initialTabId;
            const targetButton = document.querySelector(`#products-content .tab-button[data-tab="${initialTabId}"]`);
            if (targetButton) {
                targetButton.click();
                return; // 클릭 이벤트를 통해 모든 로직을 처리했으므로 종료
            }
        }
        
        // 초기 탭 설정 및 배경 설정 (click 이벤트가 발생하지 않았을 경우)
        updateProductHeroBackground(defaultTabId); 
        const activeContent = document.getElementById(defaultTabId);
        if (activeContent) {
            // 초기 로드 시 active 클래스가 이미 부여되어 있다고 가정하고 애니메이션 실행
            activeContent.classList.add('active'); 
            handleGalleryFadeIn(activeContent);
        }
    }


    // -----------------------------------------------------------------
    // 2. Buyers 페이지 (고객사) 로직 - script.js에 통합됨 (이 파일에서는 제거)
    // -----------------------------------------------------------------
    // Buyers 페이지 관련 로직은 script.js에 통합되어 중복을 피합니다. 
    // 여기서는 Products 페이지 로직만 남깁니다.
    // -----------------------------------------------------------------
});


    // -----------------------------------------------------------------
    // 2. Buyers 페이지 (고객사) 로직 - script.js에 통합됨 (이 파일에서는 제거)
    // -----------------------------------------------------------------
    // Buyers 페이지 관련 로직은 script.js에 통합되어 중복을 피합니다. 
    // 여기서는 Products 페이지 로직만 남깁니다.
    // -----------------------------------------------------------------
});
