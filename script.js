document.addEventListener('DOMContentLoaded', () => {
    // 모바일 메뉴 토글 기능
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // 스크롤 시 요소에 애니메이션 효과 적용
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // 뷰포트에 10% 보이면 애니메이션 시작

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // 초기 로드 시 히어로 섹션 애니메이션 적용
    const heroContent = document.querySelector('.hero-content');
    const heroElements = heroContent.querySelectorAll('.fade-in');
    
    heroElements.forEach(element => {
        element.classList.add('active');
    });
});
