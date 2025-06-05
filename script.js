document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  // 1) Näytetään header etusivulla aluksi
  if (header.classList.contains('preload')) {
    requestAnimationFrame(() => header.classList.remove('preload'));
  }

  // 2) Siirryttäessä toiselle sivulle -> header pois
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) {
        header.classList.add('collapsed');
      }
    });
  });

  // 3) Klikkaamalla kolmiota -> header palaa näkyviin
  header.addEventListener('click', (e) => {
    const target = e.target;
    if (target === header || target === header.querySelector('::after')) return;
    const bounds = header.getBoundingClientRect();
    if (e.clientY >= bounds.bottom - 30 && header.classList.contains('collapsed')) {
      header.classList.remove('collapsed');
    }
  });
});
