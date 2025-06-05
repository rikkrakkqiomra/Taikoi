// script.js

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  // Jos käyttäjä tulee takaisin index-sivulle, suoritetaan laskostunut tilan purku
  if (
    sessionStorage.getItem('headerCollapsed') === 'true' &&
    location.pathname.endsWith('index.html')
  ) {
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');

      // Jos ollaan jo halutulla sivulla, ei tehdä mitään
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Jos navigoidaan takaisin index.html:ään, skipataan nykyisen sivun collapsing-animointi
      if (target === 'index.html') {
        sessionStorage.setItem('headerCollapsed', 'true');
      } else {
        header.classList.add('collapsed');
        sessionStorage.setItem('headerCollapsed', 'true');
      }

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
