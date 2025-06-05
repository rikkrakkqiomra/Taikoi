/* Korjattu: Header animation controller
   References original markup in index.html lines 11-19 :contentReference[oaicite:0]{index=0} */

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  /* Jos tulimme juuri alisivulta pääsivulle, laajenna header liukumalla alas */
  if (sessionStorage.getItem('headerCollapsed') === 'true' &&
      location.pathname.endsWith('index.html')) {
    // Lisätään ensin collapsed-tila ilman siirtymää (poistaa välähdyksen)
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      // Pieni viive, jotta selaimen layout ehti asetella collapsed-tilan
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  /* Lisää kaikille navigaatiolinkeille click-kuuntelija */
  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');

      // Jos jo ollaan kohdesivulla, ei tehdä mitään
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Lisää collapse-luokka, jolloin header liukuu ylös (jos ollaan indexillä)
      // tai pysyy piilossa (jos ollaan jo alisivulla). Merkataan sessionStorageen,
      // jotta index-sivulla osataan liu'uttaa alas.
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');

      // Haetaan animoitu siirtymänopeus CSS-muuttujasta (--anim-speed)
      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--anim-speed')
      ) || 450;

      // Odotetaan, että liukumisen siirtymä ehtii näkyä ennen sivulle siirtymistä
      setTimeout(() => {
        location.href = target;
      }, speed);
    });
  });
});

