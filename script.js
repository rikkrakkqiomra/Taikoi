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

  // Check if header is visually collapsed by inspecting computed transform
  const isHeaderVisuallyCollapsed = () => {
    const computedStyle = getComputedStyle(header);
    const transform = computedStyle.transform;
    // Check if translateY is not 0 (indicating header is moved up)
    return transform && transform !== 'none' && transform.includes('translateY') && !transform.includes('translateY(0px)');
  };

  // Robust header expand animation
  const playHomeExpand = () => {
    // Reset and then explicitly play expand animation class
    header.classList.add('no-transition');
    header.classList.add('collapsed');
    header.classList.remove('play-expand');
    void header.offsetWidth;
    header.classList.remove('no-transition');
    // Next frame, trigger explicit animation class which animates from collapsed to open
    requestAnimationFrame(() => {
      header.classList.add('play-expand');
      // Ensure final state is clean
      setTimeout(() => {
        header.classList.remove('collapsed');
        header.classList.remove('play-expand');
      }, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--anim-speed')) || 650);
    });
  };

  // More inclusive detection for back navigation and stuck header states
  const handlePageRestore = (evt) => {
    if (!isHome()) return;
    
    // More inclusive conditions: trigger if any of these are true
    const shouldPlay = 
      header.classList.contains('collapsed') || 
      sessionStorage.getItem('headerCollapsed') === 'true' || 
      isHeaderVisuallyCollapsed() ||  // NEW: Check actual visual state
      (evt && evt.persisted === true);
    
    if (!shouldPlay) return;
    
    // Clear the flag to avoid double triggers
    if (sessionStorage.getItem('headerCollapsed') === 'true') {
      sessionStorage.removeItem('headerCollapsed');
    }
    playHomeExpand();
  };

  // Fallback checker for stuck headers (runs periodically)
  const checkStuckHeader = () => {
    if (isHome() && isHeaderVisuallyCollapsed()) {
      console.log('Detected stuck header, triggering expand animation');
      playHomeExpand();
    }
  };

  // Multiple event listeners to catch different navigation scenarios
  window.addEventListener('pageshow', handlePageRestore);
  window.addEventListener('popstate', () => handlePageRestore({ persisted: true }));
  window.addEventListener('focus', () => {
    if (isHome()) setTimeout(checkStuckHeader, 100);
  });
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isHome()) {
      setTimeout(checkStuckHeader, 100);
    }
  });

  // Additional fallback: check for stuck header after DOM is ready
  setTimeout(checkStuckHeader, 500);
});

