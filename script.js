document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // 메뉴 토글 버튼 클릭 이벤트
    if(menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }

    // 모바일 메뉴 항목 클릭 시 메뉴 닫기 (선택 사항)
    const mobileMenuItems = document.querySelectorAll('.mobile-menu ul li a');
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
});
