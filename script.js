/* Korjattu: Header animation controller */

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  /* Jos tulimme juuri alisivulta pääsivulle (index.html), liu’utetaan header alas */
  if (sessionStorage.getItem('headerCollapsed') === 'true' &&
      location.pathname.endsWith('index.html')) {

    // Asetetaan ensin collapsed-tila ilman siirtoa, jotta ei tule vilkkumista
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      // Pieni viive, jotta browser ehditään asettaa collapsed-tila
      setTimeout(() => {
        // Poistetaan supistettu tila, koska haluamme liu’uttaa headerin alas
        header.classList.remove('collapsed');
        // Tyhjennetään merkintä, ettei seuraavalla kerralla indexillä pyritä uudelleen liu’uttamaan
        sessionStorage.removeItem('headerCollapsed');
      }, 50);
    });
  }

  /* Kun klikataan mitä tahansa nav-linkkiä */
  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');

      // Jos jo ollaan kohdesivulla, ei tehdä mitään
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Aseta collapsed-luokka: header liukuu ylös (pääsivulla) tai pysyy piilossa (alisivulla)
      header.classList.add('collapsed');
      // Merkitään sessionStorageen, jotta index-sivulla tiedetään että header on stays collapsed
      sessionStorage.setItem('headerCollapsed', 'true');

      // Haetaan siirtymänopeus CSS-käytetystä --anim-speed-muuttujasta
      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--anim-speed')
      ) || 450;

      // Odotetaan transitionin verran ennen navigointia, jotta liukumisen ehtii näkyä
      setTimeout(() => {
        location.href = target;
      }, speed);
    });
  });
});
