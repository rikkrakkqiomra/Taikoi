/**
 * Gold Digger Technologies – headerin liukuanimaatio
 * --------------------------------------------------
 *  • Etusivu (index.html): header romahtaa ylös, kun hero-osio poistuu näkyvistä.
 *  • Alisivut (class="subpage"): header on kaadettuna HTML-tasolla ja
 *    liukuu alas heti sivun latauduttua.
 */
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const isSubpage = document.body.classList.contains('subpage');

  /* --- Alisivut: avaa header pehmeästi ----------- */
  if (isSubpage) {
    // Lyhyt viive varmistaa, että CSS-transition aktivoituu.
    requestAnimationFrame(() => header.classList.remove('collapsed'));
    return; // Ei tarvita scroll-logiikkaa alisivuilla
  }

  /* --- Etusivu: romahda ylös kun hero katoaa ----- */
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Kun hero ei ole näkyvissä, header saa 'collapsed'-luokan
        header.classList.toggle('collapsed', !entry.isIntersecting);
      });
    },
    { threshold: 0 }
  );

  observer.observe(hero);
});



  

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

