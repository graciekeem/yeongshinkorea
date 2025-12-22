// ===========================================
// 4. Contact Form (contact.html)
// ===========================================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const languageMessages = {
  ko: {
    sending: '메시지를 보내는 중입니다...',
    success: '문의 메시지가 성공적으로 전송되었습니다!',
    failure: '메시지 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
    error: '네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.'
  },
  en: {
    sending: 'Sending your message...',
    success: 'Your inquiry message has been sent successfully!',
    failure: 'Failed to send message. Please try again shortly.',
    error: 'A network error occurred. Please try again later.'
  },
  zh: {
    sending: '正在发送您的消息...',
    success: '您的咨询信息已成功发送！',
    failure: '消息发送失败。请稍后再试。',
    error: '发生网络错误。请稍后重试。'
  }
};

if (contactForm && formStatus) {
  const currentLang = (document.documentElement.lang || 'ko').toLowerCase();
  const currentMessages = languageMessages[currentLang] || languageMessages.ko;

  const emailLocal = document.getElementById('email_local');
  const emailDomainSelect = document.getElementById('email_domain_select');
  const emailDomainManual = document.getElementById('email_domain_manual');
  const finalEmail = document.getElementById('final_email');

  emailDomainSelect.addEventListener('change', function () {
    if (this.value === 'self') {
      emailDomainManual.style.display = 'block';
      emailDomainManual.setAttribute('required', 'required');
      emailDomainManual.focus();
    } else {
      emailDomainManual.style.display = 'none';
      emailDomainManual.removeAttribute('required');
    }
  });

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    let domain = '';
    if (emailDomainSelect.value === 'self') {
      domain = emailDomainManual.value;
    } else {
      domain = emailDomainSelect.value;
    }

    if (!emailLocal.value || !domain) {
      formStatus.innerHTML =
        `❌ ${
          currentLang === 'ko'
            ? '이메일 주소를 올바르게 입력해 주세요.'
            : currentLang === 'en'
            ? 'Please enter a valid email address.'
            : '请输入正确的电子邮件地址。'
        }`;
      formStatus.style.color = 'red';
      return;
    }

    finalEmail.value = `${emailLocal.value}@${domain}`;

    const formData = new FormData(contactForm);

    formStatus.innerHTML = currentMessages.sending;
    formStatus.style.color = '#182c6b';

    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      window.dataLayer = window.dataLayer || [];

      if (response.ok) {
        formStatus.innerHTML = currentMessages.success;
        formStatus.style.color = 'green';

        window.dataLayer.push({ event: 'form_submit_success' });

        contactForm.reset();
        emailDomainManual.style.display = 'none';
        emailDomainSelect.value = '';
      } else {
        formStatus.innerHTML = currentMessages.failure;
        formStatus.style.color = 'red';

        window.dataLayer.push({ event: 'form_submit_failure' });
      }
    } catch (error) {
      formStatus.innerHTML = currentMessages.error;
      formStatus.style.color = 'red';

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_submit_error' });
    }
  });
}
