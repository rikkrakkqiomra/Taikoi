/* Header animation controller
   References original markup in index.html lines 10-24 :contentReference[oaicite:1]{index=1} */

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  /* If we just came from a sub-page, expand the header smoothly */
  if (sessionStorage.getItem('headerCollapsed') === 'true' &&
      location.pathname.endsWith('index.html')) {
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  /* Intercept clicks that go to other HTML pages */
  navLinks.forEach(link => {
    const target = link.getAttribute('href');
    if (target && target.endsWith('.html') && !target.includes('#')) {
      link.addEventListener('click', evt => {
        if (target === location.pathname.split('/').pop()) return;
        evt.preventDefault();
        header.classList.add('collapsed');
        sessionStorage.setItem('headerCollapsed', 'true');

        /* Wait for the CSS transition before navigation */
        const speed = parseFloat(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--anim-speed')
        ) || 450;
        setTimeout(() => (location.href = target), speed);
      });
    }
  });
});

