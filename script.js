document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  // Kun sivu latautuu ja edellisellä sivulla oli klikkauksen yhteydessä asetettu headerCollapsed,
  // tehdään häivytys-efekti eli korjataan collapsed-tila kaikissa alisivuissa ja indexissä.
  if (sessionStorage.getItem('headerCollapsed') === 'true') {
    // Aseta ensin collapsed, jotta voimme animoinnin kautta poistaa sen hetken kuluttua
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      setTimeout(() => {
        header.classList.remove('collapsed');
      }, 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', evt => {
      const target = link.getAttribute('href');

      // Jos ollaan jo samassa sivussa, ei tehdä mitään
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Pane header collapsed-tilaan ja merkitse sessionStorageen,
      // jotta seuraavalla sivulatauksella tiedämme tehdä häivytyksen
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');

      // Haetaan CSS:stä määritelty animaation kesto (--anim-speed), oletus 450ms
      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--anim-speed')
      ) || 450;

      // Odotetaan animaation verran ja sitten tehdään sivunvaihto
      setTimeout(() => {
        location.href = target;
      }, speed);
    });
  });
});
