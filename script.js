// Header-animaatiot ja navigointi
document.addEventListener('DOMContentLoaded', () => {
  const header   = document.getElementById('siteHeader');
  const links    = document.querySelectorAll('.nav-link');
  const speed    = 500;                         // vastaa --anim-speed CSS:ssä

  /* 1. Alaspäin tuleva animaatio etusivulla */
  if (header.classList.contains('entering')) {
    requestAnimationFrame(() => header.classList.add('show'));
    header.addEventListener('transitionend', () => {
      header.classList.remove('entering', 'show');
    }, { once: true });
  }

  /* 2. Linkin klikkaus -> header liukuu ylös, kolmio jää */
  links.forEach(link => {
    const target = link.getAttribute('href');

    // Skipataan anchorit ja etusivulinkit:
    if (!target || target === '#' || target === 'index.html') return;

    link.addEventListener('click', evt => {
      evt.preventDefault();

      header.classList.add('collapsed');
      setTimeout(() => window.location.href = target, speed);
    });
  });

  /* 3. Kolmion (käytännössä koko headerin) klikkaus alisivulla palauttaa etusivulle */
  header.addEventListener('click', () => {
    if (!header.classList.contains('collapsed')) return;

    // Näytetään animaatio alas ennen siirtymistä
    header.classList.remove('collapsed');
    setTimeout(() => window.location.href = 'index.html', speed);
  });
});
