/* ===============================
   Yeongsh!n Korea — Multi-page CSS
   primary: #182c6b / accent: #d18e13
================================= */
:root{
  --primary:#182c6b;
  --accent:#d18e13;
  --text:#222;
  --muted:#6f7480;
  --bg:#ffffff;
  --line:#e9edf1;
  --radius:12px;
}

*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{
  font-family:system-ui,Pretendard,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
  color:var(--text); background:var(--bg); line-height:1.6;
}

.container{max-width:1200px;margin:0 auto;padding:0 20px}
.section{padding:80px 0;border-bottom:1px solid var(--line)}
.section-title{margin:0 0 16px;text-align:center;color:var(--primary);font-size:1.9rem}
.lead{color:var(--muted);}

/* ========== Header & Nav ========== */
.navbar{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid var(--line)}
.nav-container{display:flex;align-items:center;gap:20px;height:72px}
.nav-logo img{height:30px;display:block}

.nav-links ul{display:flex;list-style:none;gap:18px;margin:0;padding:0}
.nav-links a{color:var(--text);text-decoration:none;padding:10px 12px;border-radius:10px;transition:color .15s,background .15s}
.nav-links a:hover{color:var(--primary);background:#f6f8ff}
.nav-links a.active{background:var(--primary);color:#fff}

.language-switcher{font-size:.9rem;color:var(--muted)}
.language-switcher a{color:var(--muted);text-decoration:none}
.language-switcher a.active{font-weight:700;color:var(--primary)}

.menu-toggle{display:none;border:0;background:transparent;font-size:22px;color:var(--primary)}

/* 모바일 메뉴(접힘) */
.mobile-menu{display:none;background:#fff;border-top:1px solid var(--line)}
.mobile-menu ul{list-style:none;margin:0;padding:8px 0}
.mobile-menu li{border-bottom:1px solid var(--line)}
.mobile-menu a{display:block;padding:12px 20px;color:var(--text);text-decoration:none}

/* ========== Hero ========== */
.hero-section{position:relative;min-height:500px;overflow:hidden}
.hero-bg-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* 필요 없으면 .hero-overlay 요소 자체를 HTML에서 지워도 됩니다 */
.hero-overlay{position:absolute;inset:0;background:rgba(24,44,107,.35)}
.hero-content{position:relative;z-index:1;color:#fff;padding:160px 0 80px}
.hero-content h1{font-size:2.8rem;line-height:1.25;margin:0 0 14px}
.hero-content p{color:#eef2ff;margin:0 0 22px}

/* ========== Buttons ========== */
.btn{display:inline-block;padding:12px 18px;border-radius:10px;text-decoration:none;
     background:var(--accent);color:#fff;border:1px solid var(--accent);transition:opacity .15s}
.btn:hover{opacity:.9}

/* ========== Intro / Organization images ========== */
.intro-image img{
  display:block;max-width:100%;height:auto;margin:0 auto;border-radius:12px;border:1px solid var(--line);
}
.organization-chart-container{padding:20px 0;overflow-x:auto}
.organization-chart-container img{
  display:block;max-width:800px;width:auto;height:auto;margin:0 auto;
}
/* 모바일에서 모바일용 조직도만 노출 + 꽉 채움 */
@media (max-width:768px){
  .organization-chart-container .pc-chart{display:none}
  .organization-chart-container .mobile-chart{display:block;max-width:100%;width:100%}
}

/* ========== Grids (Products / Buyers) ========== */
.image-gallery,
.buyer-gallery{
  display:grid; gap:24px;
  grid-template-columns:repeat(auto-fill, minmax(180px,1fr));
}
.image-item, .buyer-item{ text-align:center; }
.image-item img, .buyer-item img{
  width:100%; height:auto; display:block; border:1px solid var(--line);
  border-radius:12px; background:#fff;
}
.image-item p{margin:8px 0 0;color:var(--muted);font-size:.95rem}

/* ========== Contact form ========== */
.contact-form{max-width:640px;margin:0 auto}
.contact-form input,.contact-form textarea{
  width:100%;padding:12px;border:1px solid var(--line);border-radius:10px;font:inherit;margin-bottom:14px
}
.submit-btn{width:100%;border:0;cursor:pointer}

/* ========== Footer ========== */
footer{padding:40px 0;text-align:center;color:var(--muted);background:#f8f9fb}

/* ========== Responsive ========== */
@media (max-width:960px){
  .image-gallery, .buyer-gallery{
    grid-template-columns:repeat(auto-fill, minmax(160px,1fr));
  }
}
@media (max-width:900px){
  /* 모바일: 햄버거 좌측, 로고 다음, 언어 스위치는 숨김(선택) */
  .menu-toggle{display:block;order:1}
  .nav-logo{order:2}
  .nav-links{order:3}
  .right-menu .language-switcher{display:none}
  .nav-links ul{display:none}
  /* 펼침 상태 */
  .navbar.open .mobile-menu{display:block}
  .hero-content{text-align:center;padding-top:200px}
  .hero-content h1{font-size:2.2rem}
}
@media (max-width:600px){
  .section{padding:60px 0}
}
