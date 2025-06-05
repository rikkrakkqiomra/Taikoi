// script.js

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  // Jos edellisellä sivulla on tallennettu animaatio-lippu, suoritetaan animaatio
  if (sessionStorage.getItem('headerCollapsed') === 'true') {
    // Aloitetaan header "collapsed"-tilasta
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      // Odotetaan hetki ja poistetaan "collapsed", jolloin header liukuu alas
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');

      // Jos klikattu linkki osoittaa samaan sivuun, ei tehdä mitään
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Merkitään, että seuraavalla sivulla pitää näyttää header-animaatio
      sessionStorage.setItem('headerCollapsed', 'true');

      // Jos header ei ole vielä collapsed-tilassa, lisätään se,
      // jotta se liukuu ylöspäin kuluessa animaatiosta
      if (!header.classList.contains('collapsed')) {
        header.classList.add('collapsed');
      }

      // Haetaan animaation kesto CSS-muuttujasta
      const speedVal = getComputedStyle(document.documentElement)
        .getPropertyValue('--anim-speed');
      const speed = parseFloat(speedVal) || 450;

      // Odotetaan animaation verran ja siirrytään sitten target-sivulle
      setTimeout(() => {
        location.href = target;
      }, speed);
    });
  });
});
