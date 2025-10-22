/* ===============================
   Yeongsh!n Korea — Multi-page JS
================================= */

// -------- Mobile menu toggle --------
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    if (mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'block';
    } else {
      mobileMenu.style.display = 'none';
    }
  });
}

// -------- Fade-in on scroll --------
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeEls.forEach((el) => observer.observe(el));

// -------- Language switcher active --------
(function() {
  const path = location.pathname;
  const currentLang = path.includes('/en/') ? 'ENG' :
                      path.includes('/zh/') ? '中文' : '한국어';
  document.querySelectorAll('.language-switcher a').forEach(a => {
    if (a.textContent.trim() === currentLang) a.classList.add('active');
  });
})();

// -------- Nav active highlight --------
(function() {
  const cur = window.CURRENT_PAGE;
  if (!cur) return;
  document.querySelectorAll(`[data-nav="${cur}"]`).forEach(el => {
    el.classList.add('active');
  });
})();

// -------- Contact form async submission (optional) --------
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  const status = document.querySelector('#formStatus');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '메시지 전송 중...';
    const data = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        status.textContent = '전송 완료! 감사합니다.';
        contactForm.reset();
      } else {
        status.textContent = '오류가 발생했습니다. 다시 시도해주세요.';
      }
    } catch (err) {
      status.textContent = '네트워크 오류입니다.';
    }
  });
}
