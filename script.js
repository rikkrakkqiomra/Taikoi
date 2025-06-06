document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const logoImg = document.querySelector('.logo-img');

  if (header.classList.contains('collapsed')) {
    const startTransition = () => {
      // Force style flush
      void header.offsetWidth;
      setTimeout(() => {
        header.classList.remove('collapsed');
      }, 50);
    };

    // Jos kuva on jo ladattu (esim. välimuistista)
    if (logoImg.complete) {
      startTransition();
    } else {
      // Muuten odotetaan, että kuva latautuu
      logoImg.addEventListener('load', startTransition);
    }
  }
});

  sessionStorage.removeItem('headerCollapsed');
}
  

  if (sessionStorage.getItem('headerCollapsed') === 'true' &&
      location.pathname.endsWith('index.html')) {

    header.classList.add('collapsed');
    requestAnimationFrame(() => {

      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }
  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');


      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();


      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');


      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--anim-speed')
      ) || 450;

      setTimeout(() => {
        location.href = target;
      }, speed);
    });
  });
});

