/* Header animation controller
   References original markup in index.html lines 10–24 :contentReference[oaicite:1]{index=1} */

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  /* If we just came from a sub-page, expand the header smoothly on index */
  if (
    sessionStorage.getItem('headerCollapsed') === 'true' &&
    location.pathname.endsWith('index.html')
  ) {
    // Start “collapsed” so that logo is hidden
    header.classList.add('collapsed');

    // In the next frame, remove the class so header “pops” open
    requestAnimationFrame(() => {
      setTimeout(() => {
        header.classList.remove('collapsed');
      }, 50);
    });

    sessionStorage.removeItem('headerCollapsed');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      // Only run on INDEX page; if already on a subpage, links go directly
      if (!location.pathname.endsWith('index.html')) return;

      event.preventDefault();
      const target = link.href;

      // Add collapsed class (hides logo + text, keeps only nav)
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');

      // Wait for CSS transition (--anim-speed) before actually navigating
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
