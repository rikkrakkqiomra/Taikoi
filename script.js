// script.js
document.addEventListener('DOMContentLoaded', () => {
  const header   = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  /* 1) Pudota header alas vain etusivulla latauksen jälkeen */
  if (header.classList.contains('preload')) {
    requestAnimationFrame(() => header.classList.remove('preload'));
  }

  /* 2) Nostetaan header pois näkyvistä kun linkkiä klikataan */
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Vältä animointi, jos linkki kohdistuu samaan sivuun (#-ankkuri)
      if (link.getAttribute('href').startsWith('#')) return;
      header.classList.add('collapsed');
    });
  });
});
