document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.main-nav a');
  let isNavigating = false;

  // Compute and set a stable collapse offset in pixels to avoid % warping
  function setHeaderCollapseOffset() {
    if (!header) return;
    // Measure once per call; avoid reading during active transitions
    const headerRect = header.getBoundingClientRect();
    const headerHeight = Math.max(0, Math.round(headerRect.height));
    const isDesktop = window.matchMedia('(min-width: 601px)').matches;
    const ratio = isDesktop ? 0.8 : 0.6; // preserve previous visual intent
    const offsetPx = Math.round(headerHeight * ratio);
    document.documentElement.style.setProperty('--header-collapse-offset', `${offsetPx}px`);
  }

  // Debounce resize to prevent thrash
  let resizeRaf = 0;
  function onResize() {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      setHeaderCollapseOffset();
    });
  }
  
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
      // Ensure offset var is set before animating open
      setHeaderCollapseOffset();
      // Force style flush once
      void header.offsetWidth;
      setTimeout(() => header.classList.remove('collapsed'), 50);
    });
    sessionStorage.removeItem('headerCollapsed');
  }

  // Handle navigation links with i18n support
  navLinks.forEach(link => {
    link.addEventListener('click', (evt) => {
      if (isNavigating) return;
      const target = link.getAttribute('href');
      
      // Check if we're already on the target page
      if (location.pathname.endsWith(target)) {
        return;
      }

      evt.preventDefault();

      // Collapse header for animation
      header.classList.add('collapsed');
      sessionStorage.setItem('headerCollapsed', 'true');
      isNavigating = true;

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
  // Set header offset once DOM is ready
  setHeaderCollapseOffset();
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize);
  
  // Also listen for i18n ready event in case it's not ready yet
  window.addEventListener('i18nReady', updateNavigationLinks);

  // Mobile viewport height fix for iOS Safari dynamic toolbars
  function setVhVar() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVhVar();
  window.addEventListener('resize', setVhVar, { passive: true });
  window.addEventListener('orientationchange', setVhVar);
});

