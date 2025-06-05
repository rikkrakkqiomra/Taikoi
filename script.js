/* script.js – Päivitetty header-animaation lisäämiseksi
   Tässä tiedostossa kuunnellaan klikkauksia navigaatiolinkeissä etusivulla (index.html)
   ja lisätään luokka `.collapsed`, jolloin header (sekä kolmio) liukuu ylös.
   Kun siitä siirrytään takaisin etusivulle, header avautuu uudelleen suljetusta tilasta. */

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');

  /* Jos tulimme juuri alisivulta etusivulle, avataan header */
  if (
    sessionStorage.getItem('headerCollapsed') === 'true' &&
    // Varmistetaan, että ollaan index.html:ssä (eli ei ole body-elem. luokalla "subpage")
    !document.body.classList.contains('subpage')
  ) {
    // Aseta header suljettuun tilaan heti, jotta animaatio lähtee oikeasta pisteestä
    header.classList.add('collapsed');
    // Seuraavassa kehityskehityskierrossa (frame) poistetaan luokka, jolloin header liukuu alas
    requestAnimationFrame(() => {
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    // Poistetaan merkintä sessionStoragesta, jotta tätä ei toisteta uudelleen
    sessionStorage.removeItem('headerCollapsed');
  }

  /* Funktio, joka sulkee headerin ja navigoi alisivulle animaation jälkeen */
  function collapseAndNavigate(event) {
    event.preventDefault();
    const targetHref = event.currentTarget.getAttribute('href');

    // Asetetaan luokka, jolloin header (ja kolmio) liukuu ylös
    header.classList.add('collapsed');
    // Tallennetaan muistiin, että header oli suljettuna, jotta palaaminen indexille avaa sen
    sessionStorage.setItem('headerCollapsed', 'true');

    // Haetaan animaation kesto CSS-muuttujasta (--anim-speed), oletus 450 ms
    const speed = parseFloat(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--anim-speed')
    ) || 450;

    // Odotetaan animaation verran ennen sivunvaihtoa
    setTimeout(() => {
      window.location.href = targetHref;
    }, speed);
  }

  /* Asetetaan klikkaustapahtuma navigaatiolinkeille vain, jos ollaan etusivulla */
  if (!document.body.classList.contains('subpage')) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Vain .html-pääteiset (alisivut), ei esim. index.html linkkiin uudelleen
      if (href && href.endsWith('.html') && href !== 'index.html') {
        link.addEventListener('click', collapseAndNavigate);
      }
    });
  }
});

