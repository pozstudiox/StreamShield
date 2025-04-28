document.addEventListener('DOMContentLoaded', () => {
  // 1. Fade-in animasyonu
  const faders = document.querySelectorAll('.fade-in');
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.animationName = 'fadeInUp';
        o.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  faders.forEach(el => obs.observe(el));

  // 2. Aktif navbar link
  const sections = document.querySelectorAll('section[id], footer#contact');
  const links = document.querySelectorAll('.menu a');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      const bottom = top + sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (y >= top && y < bottom) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });

    // 3. Back-to-top görünümü
    const btn = document.getElementById('back-to-top');
    if (btn) {
      btn.style.display = y > 300 ? 'flex' : 'none';
    }
  });

  // 4. Back-to-top tıklama
  const btnTop = document.getElementById('back-to-top');
  if (btnTop) {
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // 5. Hero harf harf animasyon
  const h1 = document.querySelector('.hero-content h1');
  if (h1) {
    const txt = h1.textContent.trim();
    h1.textContent = '';
    txt.split('').forEach((ch, i) => {
      const sp = document.createElement('span');
      sp.textContent = ch;
      sp.style.animationDelay = `${i * 0.05}s`;
      h1.appendChild(sp);
    });
  }

  // 6. Geri Bildirim Paneli
  const feedbackBtn = document.getElementById('feedback-toggle');
  const feedbackPanel = document.querySelector('.feedback-panel');
  if (feedbackBtn && feedbackPanel) {
    feedbackBtn.addEventListener('click', () => {
      feedbackPanel.classList.toggle('hidden');
    });
  }
});
