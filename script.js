document.addEventListener('DOMContentLoaded', () => {
  // ===== Year in footer =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Mobile menu toggle =====
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('active');
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on link click (mobile UX)
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ===== Motion preference =====
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== Intersection Observer for fade-ins =====
  if (!prefersReduce) {
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

    // Initial hero activation (above the fold)
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.querySelectorAll('.fade-in').forEach(el => el.classList.add('active'));
    }
  } else {
    // If reduced motion, ensure all are visible
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('active'));
  }
});
