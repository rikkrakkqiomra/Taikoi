// i18n Framework for Gold Digger Technologies
class I18n {
  constructor() {
    try {
      console.log('Initializing I18n constructor...');
      this.supportedLanguages = ['fi', 'en', 'de', 'fr', 'es', 'nl', 'pl'];
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
      this.supportedLanguages = ['fi', 'en', 'de', 'fr', 'es', 'nl', 'pl'];
      this.defaultLanguage = 'fi';
      this.currentLang = 'fi';
      this.translations = {};
    }
  }

  async init() {
    console.log('Initializing i18n with language:', this.currentLang);
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
    const path = window.location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})\//);
    return langMatch ? langMatch[1] : null;
  }

  async loadTranslations() {
    console.log('Loading translations for language:', this.currentLang);
    try {
      const basePath = window.location.protocol === 'file:' ? 'translations' : '/translations';
      const response = await fetch(`${basePath}/${this.currentLang}.json`);
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
      },
      'es': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Verificabilidad total. Gestionabilidad. Modularidad.',
        'hero_welcome': 'Bienvenido a una era en la que la inteligencia artificial no solo funciona – funciona correctamente:',
        'hero_description': 'Gold Digger Technologies desarrolla soluciones híbridas directas y listas...',
        'hero_cta': 'Si su organización quiere convertirse en una verdadera mina de oro de confianza...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Contacto',
        'nav_research': 'Investigación'
      },
      'nl': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Volledige verifieerbaarheid. Beheerbaarheid. Modulariteit.',
        'hero_welcome': 'Welkom in een tijdperk waarin kunstmatige intelligentie niet alleen werkt – maar correct werkt:',
        'hero_description': 'Gold Digger Technologies ontwikkelt directe, kant-en-klare hybride oplossingen...',
        'hero_cta': 'Als uw organisatie een ware goudmijn van vertrouwen en waarde wil worden...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Contact',
        'nav_research': 'Onderzoek'
      },
      'pl': {
        'site_title': 'Gold Digger Technologies',
        'hero_title': 'Pełna weryfikowalność. Zarządzalność. Modularność.',
        'hero_welcome': 'Witamy w erze, w której sztuczna inteligencja nie tylko działa — działa poprawnie:',
        'hero_description': 'Gold Digger Technologies tworzy bezpośrednie, gotowe do użycia rozwiązania hybrydowe...',
        'hero_cta': 'Jeśli Twoja organizacja chce stać się prawdziwą kopalnią zaufania i wartości...',
        'nav_gdt': 'GDT',
        'nav_contact': 'Kontakt',
        'nav_research': 'Badania'
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
    
    // Load new translations and update page (simplified - no URL changes for now)
    await this.loadTranslations();
    this.translatePage();
    this.updateHreflangTags();
    
    console.log('Language switch completed');
  }

  updateHreflangTags() {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
    
    // Add new hreflang tags
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/';
    
    // Ensure supportedLanguages is defined
    if (!this.supportedLanguages || !Array.isArray(this.supportedLanguages)) {
      console.warn('supportedLanguages not available for hreflang tags');
      return;
    }
    
    this.supportedLanguages.forEach(lang => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = lang;
      
      if (lang === this.defaultLanguage) {
        link.href = `${window.location.origin}${cleanPath}`;
      } else {
        link.href = `${window.location.origin}/${lang}${cleanPath}`;
      }
      
      document.head.appendChild(link);
    });

    // Add x-default hreflang
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${window.location.origin}${cleanPath}`;
    document.head.appendChild(xDefault);
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