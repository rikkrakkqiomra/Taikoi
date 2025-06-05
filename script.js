document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a, .triangle-link');

  /* ——— Paluu kotisivulle, laajenna header ——— */
  if (sessionStorage.getItem('headerCollapsed') === 'true'
      && location.pathname.endsWith('index.html')) {

    header.classList.add('collapsed');                // käynnistä tilassa ylhäällä
    requestAnimationFrame(() => {
      setTimeout(() => header.classList.remove('collapsed'), 40); // liuʼuta alas
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  /* ——— Linkkipainallus: supista ja odota animaatio ——— */
  navLinks.forEach(link => {
    const target = link.getAttribute('href');
    if (!target || !target.endsWith('.html')) return;

    link.addEventListener('click', evt => {
      // jos jo tällä sivulla → älä animoi
      if (target === location.pathname.split('/').pop()) return;

      evt.preventDefault();
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');

      /* odota vain transform-animaatio */
      const onEnd = e => {
        if (e.propertyName !== 'transform') return;
        header.removeEventListener('transitionend', onEnd);
        location.href = target;
      };
      header.addEventListener('transitionend', onEnd, { once: true });
    });
  });
});
