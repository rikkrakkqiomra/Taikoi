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
        const isFile = window.location.protocol === 'file:';
        const currentLang = window.i18n ? window.i18n.currentLang : 'fi';
        const langPrefix = isFile ? '' : (currentLang === 'fi' ? '/fi' : `/${currentLang}`);
        const targetPath = target.startsWith('/') || isFile ? target : `${langPrefix}/${target}`;
        location.href = targetPath;
      }, speed);
    });
  });

  // Update navigation links to include language prefixes
  function updateNavigationLinks() {
    if (window.i18n && window.i18n.isReady) {
      navLinks.forEach(link => {
         const href = link.getAttribute('href');
        const isFile = window.location.protocol === 'file:';
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          if (isFile) {
            // Keep local relative links unchanged when testing via file://
            return;
          }
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

  // Ensure header state is corrected when returning via browser back/forward (BFCache)
  const handlePageRestore = (evt) => {
    if (!isHome()) return;
    const navEntries = performance && performance.getEntriesByType ? performance.getEntriesByType('navigation') : null;
    const navType = navEntries && navEntries[0] ? navEntries[0].type : '';
    const isBackOrBFCache = (evt && evt.persisted) || navType === 'back_forward';
    if (!isBackOrBFCache) return;
    // Start from collapsed (if not already), then expand to trigger the slide
    if (!header.classList.contains('collapsed')) {
      header.classList.add('collapsed');
      void header.offsetWidth;
    }
    setTimeout(() => header.classList.remove('collapsed'), 50);
  };
  window.addEventListener('pageshow', handlePageRestore);
  window.addEventListener('popstate', () => handlePageRestore({ persisted: true }));
});

