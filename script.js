document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  // Check if current page is home (considering language prefixes)
  const isHome = () => {
    const path = location.pathname;
    return path.endsWith('index.html') ||
           path === '/' ||
           path === '' ||
           path.match(/^\/[a-z]{2}\/?$/);
  };

  // Handle header collapse animation
  if (sessionStorage.getItem('headerCollapsed') === 'true' && isHome()) {
    header.classList.add('collapsed');
    requestAnimationFrame(() => {
      void header.offsetWidth; // Force reflow
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  // Handle navigation links with i18n support
  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      const target = link.getAttribute('href');
      
      // Check if we're already on the target page
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Collapse header for animation
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');

      // Get animation speed
      const speed = parseFloat(
        getComputedStyle(document.documentElement)
          .getPropertyValue('--anim-speed')
      ) || 450;

      // Navigate to target with language support
      setTimeout(() => {
         const currentLang = window.i18n ? window.i18n.currentLang : 'fi';
         const langPrefix = currentLang === 'fi' ? '/fi' : `/${currentLang}`;
         const targetPath = target.startsWith('/') ? target : `${langPrefix}/${target}`;
        location.href = targetPath;
      }, speed);
    });
  });

  // Update navigation links to include language prefixes
  function updateNavigationLinks() {
    if (window.i18n && window.i18n.isReady) {
      navLinks.forEach(link => {
         const href = link.getAttribute('href');
         if (href && !href.startsWith('http') && !href.startsWith('#')) {
           const currentLang = window.i18n.currentLang;
           const langPrefix = currentLang === 'fi' ? '/fi' : `/${currentLang}`;
           const newHref = href.startsWith('/') ? href : `${langPrefix}/${href}`;
           link.setAttribute('href', newHref);
         }
      });
      console.log('Navigation links updated for language:', window.i18n.currentLang);
    }
  }

  // Try to update navigation links immediately if i18n is already ready
  updateNavigationLinks();
  
  // Also listen for i18n ready event in case it's not ready yet
  window.addEventListener('i18nReady', updateNavigationLinks);
});

