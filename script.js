// script.js
/**
 * Yksinkertainen header-animaatio:
 *  - klikattaessa mitä tahansa navigaatio-linkkiä (paitsi etusivu "GDT")
 *    header "katoaa" ylös ja antaa tilaa sisällölle
 *  - kun käydään etusivulla (home-linkki), header lasketaan alas takaisin
 */

const header   = document.getElementById('site-header');
const navLinks = document.querySelectorAll('.nav-link');

function collapseHeader() {
  header.classList.add('collapsed');
}

function expandHeader() {
  header.classList.remove('collapsed');
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault(); // dummy-sivuissa estetään navigaatio

    // jos on etusivu-linkki -> paluu etusivulle
    if (link.classList.contains('home-link')) {
      expandHeader();
    } else {
      collapseHeader();
    }
  });
});
