/*
  Custom lightweight i18n + language routing
  - Finnish is default (no prefix)
  - Other languages use prefix: /en/, /de/, /fr/
  - localStorage remembers user choice
  - Hreflang tags injected dynamically
  - Optimized for cross-browser compatibility
*/

// Polyfills for older browsers
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

// NodeList forEach polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

(function () {
  var supportedLanguages = ["fi", "en", "de", "fr"];
  var defaultLanguage = "fi";

  var i18n = {
    fi: {
      siteTitle: "Aivoinko Tekoäly Teknologia",
      navGallery: "Galleria",
      navContact: "Kontakti",
      navDocuments: "Dokumentit",
      followUs: "Seuraa meitä",
      homeHeadline: "Aivoinko - Innovaatioiden Ytimessä",
      homeLead1:
        "LLM/ML/AI/NN/RAG all in one -ratkaisuja tarjoava yritys nimeltä Aivoinko. Riku Korpiaho on pääarkkitehti ja erikoistunut lääketieteelliseen informatiikkaan, neurotieteeseen ja generatiiviseen tekoälyyn. Ota yhteyttä jos haluat toimintaasi varten täydellisen tekoälystrategian. Visuaalisen puolen tuotteita voit selata galleriasta, tuotetaan korttipakkoja tai kokonaisia yrityksen visuaalisen ilmeen uudistuksia.",
      homeLead2: "Ota yhteyttä vaikkapa suoraan soittamalla. Konsultointi ja kartoitus ovat lähtökohtaisesti ilmaisia.",
      contactTitle: "Ota Yhteyttä",
      contactLead: "Voit ottaa yhteyttä seuraavista kanavista:",
      documentsTitle: "Dokumentit",
      documentsIntro:
        "Tässä tulee ladattavia asiakirjoja, jotka ovat esitelmiä, esseitä, teesejä ja raportteja yrityksieni, opintojeni sekä yleisen metafysiikkani osalta.",
      download1: "Asia1 PDF",
      download2: "Asia2 PDF",
    },
    en: {
      siteTitle: "Aivoinko AI Technology",
      navGallery: "Gallery",
      navContact: "Contact",
      navDocuments: "Documents",
      followUs: "Follow us",
      homeHeadline: "Aivoinko - At the Core of Innovation",
      homeLead1:
        "A company called Aivoinko providing LLM/ML/AI/NN/RAG all‑in‑one solutions. Riku Korpiaho is the lead architect, specialized in medical informatics, neuroscience and generative AI. Get in touch for a complete AI strategy for your organization. Browse visual works in the gallery—anything from card decks to full brand makeovers.",
      homeLead2: "You can also call directly. Consulting and initial scoping are free.",
      contactTitle: "Contact",
      contactLead: "You can reach us via:",
      documentsTitle: "Documents",
      documentsIntro:
        "Downloadable documents including talks, essays, theses and reports related to my companies, studies and general metaphysics.",
      download1: "Item1 PDF",
      download2: "Item2 PDF",
    },
    de: {
      siteTitle: "Aivoinko KI‑Technologie",
      navGallery: "Galerie",
      navContact: "Kontakt",
      navDocuments: "Dokumente",
      followUs: "Folge uns",
      homeHeadline: "Aivoinko – Im Kern der Innovation",
      homeLead1:
        "Ein Unternehmen namens Aivoinko bietet LLM/ML/AI/NN/RAG All‑in‑One‑Lösungen. Riku Korpiaho ist der Hauptarchitekt, spezialisiert auf medizinische Informatik, Neurowissenschaften und generative KI. Kontaktieren Sie uns für eine umfassende KI‑Strategie. Visuelle Arbeiten finden Sie in der Galerie – von Kartensets bis zu kompletten Marken‑Relaunches.",
      homeLead2: "Sie können auch direkt anrufen. Beratung und Erstaufnahme sind kostenlos.",
      contactTitle: "Kontakt",
      contactLead: "Sie erreichen uns über:",
      documentsTitle: "Dokumente",
      documentsIntro:
        "Laden Sie Vorträge, Aufsätze, Thesen und Berichte zu meinen Unternehmen, Studien und allgemeiner Metaphysik herunter.",
      download1: "Item1 PDF",
      download2: "Item2 PDF",
    },
    fr: {
      siteTitle: "Technologie IA Aivoinko",
      navGallery: "Galerie",
      navContact: "Contact",
      navDocuments: "Documents",
      followUs: "Suivez‑nous",
      homeHeadline: "Aivoinko – Au cœur de l’innovation",
      homeLead1:
        "Aivoinko propose des solutions tout‑en‑un LLM/ML/AI/NN/RAG. Riku Korpiaho est l’architecte principal, spécialisé en informatique médicale, neurosciences et IA générative. Contactez‑nous pour une stratégie IA complète. Parcourez les créations visuelles dans la galerie, des jeux de cartes aux refontes complètes d’identité.",
      homeLead2: "Vous pouvez aussi appeler directement. Le conseil et l’étude initiale sont gratuits.",
      contactTitle: "Contact",
      contactLead: "Vous pouvez nous joindre via :",
      documentsTitle: "Documents",
      documentsIntro:
        "Documents téléchargeables : conférences, essais, thèses et rapports liés à mes entreprises, mes études et ma métaphysique générale.",
      download1: "Élément1 PDF",
      download2: "Élément2 PDF",
    },
  };

  function detectInitialLanguage() {
    var path = window.location.pathname.replace(/\\\\/g, "/");
    var match = path.match(/^\/(en|de|fr)\b/);
    if (match) {
      return match[1];
    }
    var fromStorage = localStorage.getItem("lang");
    if (fromStorage && supportedLanguages.indexOf(fromStorage) !== -1) {
      return fromStorage;
    }
    return defaultLanguage;
  }

  function getCurrentPageSlug() {
    var pathname = window.location.pathname.replace(/\\\\/g, "/");
    var withoutLang = pathname.replace(/^\/(en|de|fr)\//, "/");
    var parts = withoutLang.split("/");
    var filteredParts = [];
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) {
        filteredParts.push(parts[i]);
      }
    }
    var file = filteredParts[filteredParts.length - 1] || "index.html";
    return file;
  }

  function buildUrl(lang, pageSlug) {
    if (lang === defaultLanguage) {
      return "/" + pageSlug;
    }
    return "/" + lang + "/" + pageSlug;
  }

  function updateHreflang(pageSlug) {
    var head = document.head;
    // remove existing alternates to avoid duplicates on navigation
    var alternateLinks = head.querySelectorAll('link[rel="alternate"]');
    for (var i = 0; i < alternateLinks.length; i++) {
      alternateLinks[i].remove();
    }

    var baseHost = window.location.protocol + "//" + window.location.host;
    var langsForHreflang = ["fi", "en", "de", "fr"];
    for (var j = 0; j < langsForHreflang.length; j++) {
      var lng = langsForHreflang[j];
      var link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", lng);
      link.setAttribute("href", baseHost + buildUrl(lng, pageSlug));
      head.appendChild(link);
    }
    // x-default
    var xdef = document.createElement("link");
    xdef.setAttribute("rel", "alternate");
    xdef.setAttribute("hreflang", "x-default");
    xdef.setAttribute("href", baseHost + buildUrl(defaultLanguage, pageSlug));
    head.appendChild(xdef);
  }

  function setActiveLangButton(lang) {
    var langButtons = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < langButtons.length; i++) {
      var btn = langButtons[i];
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  function translatePage(lang) {
    var dict = i18n[lang] || i18n[defaultLanguage];
    // Title
    if (dict.siteTitle) document.title = dict.siteTitle;

    // Header
    var galleryLink = document.querySelector('[data-i18n="navGallery"]');
    if (galleryLink) galleryLink.textContent = dict.navGallery;
    var contactLink = document.querySelector('[data-i18n="navContact"]');
    if (contactLink) contactLink.textContent = dict.navContact;
    var documentsLink = document.querySelector('[data-i18n="navDocuments"]');
    if (documentsLink) documentsLink.textContent = dict.navDocuments;

    // Home
    var homeHeadline = document.querySelector('[data-i18n="homeHeadline"]');
    if (homeHeadline) homeHeadline.textContent = dict.homeHeadline;
    var homeLead1 = document.querySelector('[data-i18n="homeLead1"]');
    if (homeLead1) homeLead1.textContent = dict.homeLead1;
    var homeLead2 = document.querySelector('[data-i18n="homeLead2"]');
    if (homeLead2) homeLead2.textContent = dict.homeLead2;

    var followUs = document.querySelector('[data-i18n="followUs"]');
    if (followUs) followUs.textContent = dict.followUs;

    // Contact
    var contactTitle = document.querySelector('[data-i18n="contactTitle"]');
    if (contactTitle) contactTitle.textContent = dict.contactTitle;
    var contactLead = document.querySelector('[data-i18n="contactLead"]');
    if (contactLead) contactLead.textContent = dict.contactLead;

    // Documents
    var documentsTitle = document.querySelector('[data-i18n="documentsTitle"]');
    if (documentsTitle) documentsTitle.textContent = dict.documentsTitle;
    var documentsIntro = document.querySelector('[data-i18n="documentsIntro"]');
    if (documentsIntro) documentsIntro.textContent = dict.documentsIntro;
    var download1 = document.querySelector('[data-i18n="download1"]');
    if (download1) download1.textContent = dict.download1;
    var download2 = document.querySelector('[data-i18n="download2"]');
    if (download2) download2.textContent = dict.download2;
  }

  function updateNavHrefs(lang) {
    var slugIndex = "index.html";
    var slugGallery = "aivoinko.html";
    var slugContact = "contact.html";
    var slugDocs = "documents.html";

    function setHref(selector, slug) {
      var el = document.querySelector(selector);
      if (el) el.setAttribute("href", buildUrl(lang, slug));
    }
    setHref('[data-nav="home"]', slugIndex);
    setHref('[data-nav="gallery"]', slugGallery);
    setHref('[data-nav="contact"]', slugContact);
    setHref('[data-nav="documents"]', slugDocs);
  }

  function navigateTo(lang) {
    var pageSlug = getCurrentPageSlug();
    var target = buildUrl(lang, pageSlug);
    if (window.location.pathname !== target) {
      window.location.assign(target);
    } else {
      // same page, but still refresh translations and hreflangs
      translatePage(lang);
      updateNavHrefs(lang);
      updateHreflang(pageSlug);
      setActiveLangButton(lang);
    }
  }

  function ensureLangButtons() {
    var containerId = "lang-switcher";
    var container = document.getElementById(containerId);
    if (!container) {
      var header = document.querySelector('header');
      if (!header) return;
      container = document.createElement('div');
      container.id = containerId;
      container.className = 'lang-switcher';
      header.appendChild(container);
    }
    var flags = [
      { lang: 'fi', label: '🇫🇮' },
      { lang: 'en', label: '🇬🇧' },
      { lang: 'de', label: '🇩🇪' },
      { lang: 'fr', label: '🇫🇷' },
    ];
    container.innerHTML = '';
    for (var i = 0; i < flags.length; i++) {
      var flag = flags[i];
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn';
      btn.dataset.lang = flag.lang;
      btn.setAttribute('aria-label', 'Switch language to ' + flag.lang);
      btn.textContent = flag.label;
      // Use closure to capture the correct lang value
      (function(langToSet) {
        btn.addEventListener('click', function() {
          localStorage.setItem('lang', langToSet);
          navigateTo(langToSet);
        });
      })(flag.lang);
      container.appendChild(btn);
    }
  }

  function init() {
    var lang = detectInitialLanguage();
    var pageSlug = getCurrentPageSlug();
    // reflect current language on <html lang="...">
    try { document.documentElement.setAttribute('lang', lang); } catch (_) {}

    // Enforce language-specific URLs: redirect to prefixed path when non-default language selected on root
    var isPrefixed = /^\/(en|de|fr)\b/.test(window.location.pathname);
    if (!isPrefixed && lang !== defaultLanguage) {
      var target = buildUrl(lang, pageSlug);
      if (window.location.pathname !== target) {
        window.location.replace(target);
        return; // stop further init; page will reload in correct locale URL
      }
    }
    ensureLangButtons();
    setActiveLangButton(lang);
    translatePage(lang);
    updateNavHrefs(lang);
    updateHreflang(pageSlug);
    // persist default if none
    localStorage.setItem('lang', lang);
    setupHeaderBehavior();
    setupTerminal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Enhanced Header Animation Controller
  function HeaderAnimationController() {
    this.header = document.querySelector('header');
    this.body = document.body;
    this.isAnimating = false;
    this.currentState = this.detectPageType();
    
    this.init();
  }
  
  HeaderAnimationController.prototype.detectPageType = function() {
    var path = window.location.pathname;
    var isHomepage = path === '/' || 
                    path === '/index.html' || 
                    path.match(/^\/(en|de|fr)\/(index\.html)?$/);
    return isHomepage ? 'homepage' : 'subpage';
  };
  
  HeaderAnimationController.prototype.transitionToState = function(targetState) {
    if (this.isAnimating || this.currentState === targetState) return Promise.resolve();
    
    this.isAnimating = true;
    
    // Add transition class
    this.header.classList.add('transitioning');
    
    var promise;
    if (targetState === 'subpage') {
      promise = this.compressHeader();
    } else {
      promise = this.expandHeader();
    }
    
    var self = this;
    return promise.then(function() {
      self.currentState = targetState;
      self.isAnimating = false;
      self.header.classList.remove('transitioning');
    });
  };
  
  HeaderAnimationController.prototype.compressHeader = function() {
    var self = this;
    var logoImage = this.header.querySelector('.logo-image');
    
    // Phase 1: Fade out logo
    if (logoImage) {
      logoImage.style.transition = 'all 0.3s ease-out';
      logoImage.style.opacity = '0';
    }
    
    return new Promise(function(resolve) {
      setTimeout(function() {
        // Phase 2: Slide header up and compress
        self.header.classList.add('compressed');
        self.body.classList.add('subpage');
        
        setTimeout(resolve, 300);
      }, 300);
    });
  };
  
  HeaderAnimationController.prototype.expandHeader = function() {
    var self = this;
    var logoImage = this.header.querySelector('.logo-image');
    
    // Phase 1: Expand header and slide down
    this.header.classList.remove('compressed');
    this.body.classList.remove('subpage');
    
    return new Promise(function(resolve) {
      setTimeout(function() {
        // Phase 2: Fade in logo
        if (logoImage) {
          logoImage.style.opacity = '1';
        }
        
        setTimeout(resolve, 300);
      }, 300);
    });
  };
  
  HeaderAnimationController.prototype.handleNavigation = function(event) {
    var href = event.target.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
    
    var targetState = this.getStateFromHref(href);
    this.transitionToState(targetState);
  };
  
  HeaderAnimationController.prototype.getStateFromHref = function(href) {
    var isHomepage = href === 'index.html' || 
                    href === '/' ||
                    href.match(/\/(en|de|fr)\/index\.html$/);
    return isHomepage ? 'homepage' : 'subpage';
  };
  
  HeaderAnimationController.prototype.setupScrollBehavior = function() {
    var self = this;
    var lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
      var currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        self.header.classList.add('scrolled');
      } else {
        self.header.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  };
  
  HeaderAnimationController.prototype.init = function() {
    var self = this;
    
    // Set initial state
    this.transitionToState(this.currentState);
    
    // Setup scroll behavior
    this.setupScrollBehavior();
    
    // Add navigation listeners
    var navLinks = document.querySelectorAll('nav a, .logo a');
    for (var i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', function(e) {
        self.handleNavigation(e);
      });
    }
    
    // Handle browser back/forward
    window.addEventListener('popstate', function() {
      var newState = self.detectPageType();
      self.transitionToState(newState);
    });
  };
  
  // Legacy function for backward compatibility
  function setupHeaderBehavior() {
    return new HeaderAnimationController();
  }

  // Optional terminal/interactions if present on page
  function setupTerminal() {
    var terminalInput = document.getElementById('terminal-input') || document.querySelector('.terminal-input');
    var quotesContainer = document.getElementById('quotes');
    var terminalContainer = document.querySelector('.terminal-container');
    if (!terminalInput || !terminalContainer || !quotesContainer) return;

    var quotes = {
      imagination:
        "Einstein — 'Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world, stimulating progress, giving birth to evolution.'",
      growth:
        "Friedrich Nietzsche — 'One must be a sea, to receive a polluted stream without becoming impure.'",
    };

    terminalInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var input = this.value.trim().toLowerCase();
        this.value = '';
        quotesContainer.innerHTML = '';

        if (quotes[input]) {
          var quoteDiv = document.createElement('div');
          quoteDiv.classList.add('quote');
          quoteDiv.textContent = quotes[input];
          quotesContainer.appendChild(quoteDiv);
          setTimeout(function() { 
            quoteDiv.classList.add('show'); 
          }, 50);
        } else {
          var errorDiv = document.createElement('div');
          errorDiv.classList.add('quote');
          errorDiv.textContent = 'Ei löytynyt vastausta.';
          quotesContainer.appendChild(errorDiv);
          setTimeout(function() { 
            errorDiv.classList.add('show'); 
          }, 50);
        }

        terminalContainer.scrollTop = terminalContainer.scrollHeight;
      }
    });
  }
})();


