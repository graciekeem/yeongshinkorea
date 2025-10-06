document.addEventListener('DOMContentLoaded', () => {
    // 햄버거 메뉴 토글 버튼과 모바일 메뉴 컨테이너 요소 가져오기
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        // 1. 햄버거 버튼 클릭 시 메뉴 열고 닫기
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        // 2. 모바일 메뉴 링크 클릭 시 메뉴 닫기 (사용성 개선)
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // 메뉴를 닫고, CSS transition 효과가 적용되도록 클래스 제거
                mobileMenu.classList.remove('open'); 
            });
        });
    }

    // --- 문의하기 폼 제출 로직 (기존 코드 유지) ---
    const form = document.getElementById('contactForm');
    if (!form) return;

    const statusEl = document.getElementById('formStatus');

    const setStatus = (msg) => {
        if (statusEl) statusEl.textContent = msg;
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setStatus('전송 중...'); // Sending... / 发送中...

        try {
            const data = new FormData(form);
            const res = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (res.ok) {
                form.reset();
                // 언어에 따라 메시지 변경 (여기는 한국어 버전 기준)
                setStatus('메시지가 전송되었습니다. 곧 연락드릴게요!'); 
            } else {
                let msg = '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
                try {
                    const json = await res.json();
                    if (json && json.errors && json.errors.length) {
                        msg = json.errors.map(e => e.message).join(', ');
                    }
                } catch (_) {}
                setStatus(msg);
            }
        } catch (err) {
            setStatus('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
});
