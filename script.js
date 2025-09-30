document.addEventListener('DOMContentLoaded', () => {
  // 모바일 메뉴 토글
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const opened = mobileMenu.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !opened);
        icon.classList.toggle('fa-times', opened);
      }
      menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  // 스크롤 애니메이션
  const fadeInElements = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeInElements.forEach(el => observer.observe(el));

  // 히어로 즉시 활성화
  document.querySelectorAll('.hero-content .fade-in').forEach(el => {
    el.classList.add('active');
  });

  // 푸터 연도
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
