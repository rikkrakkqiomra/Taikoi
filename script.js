document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  // CSS-muuttujasta saatu animaation kesto (esim. "650ms" → 650)
  const rawSpeed = getComputedStyle(document.documentElement)
    .getPropertyValue('--anim-speed')
    .trim();
  const animSpeed = parseInt(rawSpeed, 10) || 650;

  // Jos tullaan alasivulta index-sivulle, annetaan headerin liukua alas
  if (sessionStorage.getItem('animateHeaderDown') === 'true') {
    // Asetetaan alussa collapsed-tila, jotta saadaan siirtymä (translateY) effects
    header.classList.add('collapsed');
    // Odotetaan, että selain on ehtinyt rekisteröidä luokanmuutoksen
    requestAnimationFrame(() => {
      setTimeout(() => {
        header.classList.remove('collapsed');
      }, 50);
    });
    sessionStorage.removeItem('animateHeaderDown');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetHref = link.getAttribute('href');

      if (targetHref.endsWith('index.html')) {
        // Kun mennään index-sivulle, muistetaan animaatiotila tallennukseen
        sessionStorage.setItem('animateHeaderDown', 'true');
        // Animoidaan navigointi heti (ei odoteta, koska index tekee avaamisen omalla skriptillään)
        window.location.href = targetHref;
      } else {
        // Kun mennään mille tahansa muulle alisivulle, supistetaan header nyt
        header.classList.add('collapsed');
        // Odotetaan animaation verran ennen navigointia
        setTimeout(() => {
          window.location.href = targetHref;
        }, animSpeed);
      }
    });
  });
});
