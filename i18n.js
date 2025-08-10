// i18n Framework for Gold Digger Technologies
class I18n {
  constructor() {
    try {
      console.log('Initializing I18n constructor...');
      this.supportedLanguages = ['fi', 'en', 'de', 'fr'];
      this.defaultLanguage = 'fi';
      this.translations = {};
      this.isReady = false;
      
      console.log('Getting stored or detected language...');
      this.currentLang = this.getStoredLanguage() || this.detectLanguage();
      console.log('Selected language:', this.currentLang);
      
      // Initialize asynchronously
      this.init().catch(error => {
        console.error('Failed to initialize i18n:', error);
      });
    } catch (error) {
      console.error('Error in I18n constructor:', error);
      // Fallback initialization
      this.supportedLanguages = ['fi', 'en', 'de', 'fr'];
      this.defaultLanguage = 'fi';
      this.currentLang = 'fi';
      this.translations = {};
    }
  }

  async init() {
    console.log('Initializing i18n with language:', this.currentLang);

    // Ensure URL uses language-prefixed structure (e.g., /fi/..., /en/...)
    try {
      const path = window.location.pathname || '/';
      const hasLangPrefix = /^\/[a-z]{2}(?:\/|$)/.test(path);
      const cleanPath = path.replace(/^\/[a-z]{2}(?:\/|$)/, '/');
      if (!hasLangPrefix) {
        const target = `/${this.currentLang}${cleanPath}`;
        // Use replace to avoid back navigation loop
        window.location.replace(target);
        return; // Stop further init; page will reload
      }
    } catch (e) {
      console.warn('Failed to enforce language-prefixed URL structure:', e);
    }
    this.setupLanguageSwitcher();
    await this.loadTranslations();
    this.translatePage();
    this.updateHreflangTags();
    
    // Notify other scripts that i18n is ready
    this.isReady = true;
    if (typeof window.onI18nReady === 'function') {
      window.onI18nReady();
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('i18nReady', { detail: { i18n: this } }));
    console.log('i18n initialization complete');
  }

  getStoredLanguage() {
    return localStorage.getItem('preferred-language');
  }

  setStoredLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
  }

  detectLanguage() {
    // Ensure supportedLanguages is defined
    if (!this.supportedLanguages || !Array.isArray(this.supportedLanguages)) {
      console.warn('supportedLanguages not properly initialized, using default');
      return this.defaultLanguage || 'fi';
    }

    // Check URL path first
    const pathLang = this.getLanguageFromPath();
    if (pathLang && this.supportedLanguages.includes(pathLang)) {
      return pathLang;
    }

    // Fall back to browser language
    const browserLang = navigator.language.split('-')[0];
    return this.supportedLanguages.includes(browserLang) ? browserLang : this.defaultLanguage;
  }

  getLanguageFromPath() {
    const path = window.location.pathname || '/';
    const langMatch = path.match(/^\/([a-z]{2})(?:\/|$)/);
    return langMatch ? langMatch[1] : null;
  }

  async loadTranslations() {
    console.log('Loading translations for language:', this.currentLang);
    try {
      const response = await fetch(`/translations/${this.currentLang}.json`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      this.translations = await response.json();
      console.log('Successfully loaded translations for', this.currentLang);
      console.log('Available keys:', Object.keys(this.translations));
    } catch (error) {
      console.warn(`Failed to load translations for ${this.currentLang}:`, error);
      
      // Fallback to hardcoded translations for testing
      console.log('Using fallback hardcoded translations');
      this.translations = this.getFallbackTranslations(this.currentLang);
      
      if (Object.keys(this.translations).length === 0) {
        console.error('No fallback translations available');
      } else {
        console.log('Fallback translations loaded:', Object.keys(this.translations));
      }
    }
  }

  getFallbackTranslations(lang) {
    const fallbackTranslations = {
      'fi': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Täysi varmennettavuus. Hallinnoitavuus. Modulaarisuus.',
        'hero_welcome': 'Tervetuloa aikakauteen, jossa tekoäly ei vain toimi – vaan toimii oikein:',
        'hero_description': 'Gold Digger Technologies tuottaa suoraviivaisia ja valmiita hybridiratkaisuja...',
        'hero_cta': 'Jos organisaatiosi haluaa muuttua todelliseksi luottamuksen ja arvon kultakaivokseksi...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Yhteystiedot',
        'nav_research': 'Tutkimus'
      },
      'en': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Complete verifiability. Manageability. Modularity.',
        'hero_welcome': 'Welcome to an era where artificial intelligence doesn\'t just work – it works correctly:',
        'hero_description': 'Gold Digger Technologies produces straightforward and ready hybrid solutions...',
        'hero_cta': 'If your organization wants to become a true gold mine of trust and value...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Contact',
        'nav_research': 'Research'
      },
      'de': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Vollständige Überprüfbarkeit. Verwaltbarkeit. Modularität.',
        'hero_welcome': 'Willkommen in einer Ära, in der künstliche Intelligenz nicht nur funktioniert – sondern richtig funktioniert:',
        'hero_description': 'Gold Digger Technologies produziert direkte und fertige Hybridlösungen...',
        'hero_cta': 'Wenn Ihre Organisation zu einer echten Goldmine des Vertrauens werden möchte...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Kontakt',
        'nav_research': 'Forschung'
      },
      'fr': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Vérifiabilité complète. Gestion. Modularité.',
        'hero_welcome': 'Bienvenue dans une ère où l\'intelligence artificielle ne fonctionne pas seulement – mais fonctionne correctement:',
        'hero_description': 'Gold Digger Technologies produit des solutions hybrides directes et prêtes...',
        'hero_cta': 'Si votre organisation veut devenir une vraie mine d\'or de confiance...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Contact',
        'nav_research': 'Recherche'
      }
    };
    
    return fallbackTranslations[lang] || {};
  }

  translate(key, params = {}) {
    let text = this.translations[key] || key;
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
    
    return text;
  }

  translatePage() {
    console.log('Translating page with language:', this.currentLang);
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translated = this.translate(key);
      console.log(`Translating ${key}: "${element.textContent}" -> "${translated}"`);
      
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translated;
      } else {
        element.textContent = translated;
      }
    });

    // Translate alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
      const key = element.getAttribute('data-i18n-alt');
      const translated = this.translate(key);
      element.alt = translated;
    });

    // Update page title
    const titleKey = document.querySelector('title').getAttribute('data-i18n');
    if (titleKey) {
      document.title = this.translate(titleKey);
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const descKey = metaDesc.getAttribute('data-i18n');
      if (descKey) {
        metaDesc.setAttribute('content', this.translate(descKey));
      }
    }

    // Update HTML lang attribute
    if (document.documentElement) {
      document.documentElement.setAttribute('lang', this.currentLang);
    }

    // Update Open Graph and Twitter tags
    this.updateSeoTags();
  }

  setupLanguageSwitcher() {
    console.log('Setting up language switcher...');
    
    // Find existing language switcher
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) {
      console.error('Language switcher not found in HTML');
      return;
    }
    
    // Add event listeners to existing buttons
    const langButtons = switcher.querySelectorAll('.lang-btn');
    console.log('Found language buttons:', langButtons.length);
    
    langButtons.forEach((btn, index) => {
      const lang = btn.getAttribute('data-lang');
      console.log(`Setting up button ${index}: ${lang}`);
      
      // Remove any existing event listeners by cloning the button
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add fresh event listener
      newBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Language button clicked:', lang);
        try {
          await this.switchLanguage(lang);
        } catch (error) {
          console.error('Failed to switch language:', error);
        }
      });
    });
    
    // Update active state based on current language
    this.updateLanguageSwitcherState();
    
    console.log('Language switcher setup complete');
  }
  
  updateLanguageSwitcherState() {
    console.log('Updating language switcher state for language:', this.currentLang);
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === this.currentLang) {
        btn.classList.add('active');
        console.log('Set active state for:', lang);
      } else {
        btn.classList.remove('active');
        console.log('Removed active state for:', lang);
      }
    });
  }

  async switchLanguage(newLang) {
    if (newLang === this.currentLang) {
      console.log('Language already set to', newLang);
      return;
    }

    console.log('Switching language from', this.currentLang, 'to', newLang);
    
    this.currentLang = newLang;
    this.setStoredLanguage(newLang);
    
    // Update language switcher state
    this.updateLanguageSwitcherState();
    
    // Navigate to URL with language prefix while preserving path
    const currentPath = window.location.pathname || '/';
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/');
    const targetUrl = newLang === this.defaultLanguage
      ? `${window.location.origin}${cleanPath}`
      : `${window.location.origin}/${newLang}${cleanPath}`;
    window.location.href = targetUrl;
  }

  updateHreflangTags() {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
    
    // Add new hreflang tags
    const currentPath = window.location.pathname || '/';
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(?:\/|$)/, '/') || '/';
    
    // Ensure supportedLanguages is defined
    if (!this.supportedLanguages || !Array.isArray(this.supportedLanguages)) {
      console.warn('supportedLanguages not available for hreflang tags');
      return;
    }
    
    this.supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      link.href = `${window.location.origin}/${lang}${cleanPath}`;
      
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${window.location.origin}${cleanPath}`;
    document.head.appendChild(xDefault);
  }

  updateSeoTags() {
    // Map language to standard locale for OG
    const ogLocaleMap = {
      fi: 'fi_FI',
      en: 'en_US',
      de: 'de_DE',
      fr: 'fr_FR'
    };

    const cleanPath = (window.location.pathname || '/').replace(/^\/[a-z]{2}(?:\/|$)/, '/') || '/';
    const canonicalUrl = `${window.location.origin}/${this.currentLang}${cleanPath}`;

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // og:url
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    // og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', ogLocaleMap[this.currentLang] || 'en_US');

    // og:site_name
    let ogSiteName = document.querySelector('meta[property="og:site_name"]');
    if (!ogSiteName) {
      ogSiteName = document.createElement('meta');
      ogSiteName.setAttribute('property', 'og:site_name');
      document.head.appendChild(ogSiteName);
    }
    ogSiteName.setAttribute('content', this.translate('site_title'));

    // og:type
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', 'website');

    // og:title from current document.title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', document.title || this.translate('site_title'));

    // og:description from data-i18n on meta tag if present
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    const ogDescKeySource = document.querySelector('meta[name="description"][data-i18n]');
    if (ogDescKeySource) {
      const key = ogDescKeySource.getAttribute('data-i18n');
      ogDesc.setAttribute('content', this.translate(key));
    }

    // og:image (use site logo as default)
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (!ogImage) {
      ogImage = document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      document.head.appendChild(ogImage);
    }
    const imageUrl = `${window.location.origin}/loko.png`;
    ogImage.setAttribute('content', imageUrl);

    // og:image:alt from logo_alt
    let ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (!ogImageAlt) {
      ogImageAlt = document.createElement('meta');
      ogImageAlt.setAttribute('property', 'og:image:alt');
      document.head.appendChild(ogImageAlt);
    }
    ogImageAlt.setAttribute('content', this.translate('logo_alt'));

    // Twitter card
    let twCard = document.querySelector('meta[name="twitter:card"]');
    if (!twCard) {
      twCard = document.createElement('meta');
      twCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twCard);
    }
    twCard.setAttribute('content', 'summary_large_image');

    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twTitle) {
      twTitle = document.createElement('meta');
      twTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twTitle);
    }
    twTitle.setAttribute('content', document.title || this.translate('site_title'));

    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement('meta');
      twDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twDesc);
    }
    if (ogDescKeySource) {
      const key = ogDescKeySource.getAttribute('data-i18n');
      twDesc.setAttribute('content', this.translate(key));
    }

    let twImage = document.querySelector('meta[name="twitter:image"]');
    if (!twImage) {
      twImage = document.createElement('meta');
      twImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twImage);
    }
    twImage.setAttribute('content', imageUrl);
  }
}

// Initialize i18n - ensure it only happens once
function initializeI18n() {
  if (window.i18n) {
    console.log('i18n already initialized, skipping...');
    return;
  }
  
  console.log('Initializing i18n...');
  window.i18n = new I18n();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting...');
  document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
  console.log('DOM already loaded, initializing i18n immediately...');
  initializeI18n();
} 