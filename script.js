/* =======================================================
   Yeongsh!n Korea — Multi-page JS (script.js)
   - Mobile: Language switcher (left) + Hamburger (right)
   - Hamburger: slide menu + icon animation (☰ → ✕)
   - Active nav & language highlight
   - Safe external links
   - Optional: Contact form async submit
======================================================= */

/* 1) 모바일 메뉴 토글 + 아이콘 애니메이션 + 접근성 */
(function () {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!navbar || !toggle || !mobileMenu) return;

  // 초기 ARIA 상태
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'mobileMenu');

  // id 없으면 부여
  if (!mobileMenu.id) mobileMenu.id = 'mobileMenu';

  const openMenu = () => {
    navbar.classList.add('open');
    toggle.classList.add('open'); // CSS가 삼선→X로 전환
    mobileMenu.style.display = 'block';
    toggle.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    navbar.classList.remove('open');
    toggle.classList.remove('open');
    mobileMenu.style.display = 'none';
    toggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    if (navbar.classList.contains('open')) closeMenu();
    else openMenu();
  };

  // 클릭으로 열고 닫기
  toggle.addEventListener('click', toggleMenu);

  // 모바일 메뉴에서 링크 클릭 시 닫기
  mobileMenu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) closeMenu();
  });

  // 리사이즈 시 데스크톱으로 올라가면 강제로 닫기
  const MQ = 900;
  window.addEventListener('resize', () => {
    if (window.innerWidth > MQ) {
      closeMenu();
      // 데스크톱에선 inline 스타일 제거(레이아웃 충돌 방지)
      mobileMenu.style.removeProperty('display');
    }
  });
})();

/* 2) 현재 페이지 메뉴 하이라이트 (각 페이지에서 window.CURRENT_PAGE 설정) */
(function () {
  const cur = window.CURRENT_PAGE; // 'company' | 'products' | 'partners' | 'contact'
  if (!cur) return;
  document.querySelectorAll(`[data-nav="${cur}"]`).forEach((a) => a.classList.add('active'));
})();

/* 3) 언어 스위처 활성화 표시 (경로 기반) */
(function () {
  const path = location.pathname;
  const currentLang = path.includes('/en/') ? 'en' : path.includes('/zh/') ? 'zh' : 'ko';

  document.querySelectorAll('.language-switcher a').forEach((a) => {
    const label = a.textContent.trim();
    const code = label === 'ENG' ? 'en' : label === '中文' ? 'zh' : 'ko';
    if (code === currentLang) a.classList.add('active');
  });
})();

/* 4) 외부 링크 보안 속성 부여 (옵션) */
(function () {
  document.querySelectorAll('a[target="_blank"]').forEach((a) => {
    a.rel = 'noopener noreferrer';
  });
})();

/* 5) 문의 폼 비동기 전송(있을 때만 동작, 실패해도 폼 기본 submit은 막음) */
(function () {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const status = document.querySelector('#formStatus');
  const setStatus = (msg) => status && (status.textContent = msg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('메시지 전송 중…');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        setStatus('전송 완료! 곧 연락드리겠습니다.');
        form.reset();
      } else {
        setStatus('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      setStatus('네트워크 오류입니다. 연결 상태를 확인해주세요.');
    }
  });
})();
