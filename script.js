document.addEventListener('DOMContentLoaded', () => {
  // 모바일 메뉴 토글
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      // 아이콘 토글 원하면 여기서 path 바꾸기 (현재는 햄버거만 유지)
      // menuToggle.classList.toggle('open');
    });
  }

  // 스크롤 페이드인
  const fadeInElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeInElements.forEach(el => observer.observe(el));

  // 히어로 즉시 활성화
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.querySelectorAll('.fade-in').forEach(el => el.classList.add('active'));
  }

  // 푸터 연도
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
