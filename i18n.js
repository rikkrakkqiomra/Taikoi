// i18n Framework for Gold Digger Technologies
class I18n {
  constructor() {
    this.currentLang = this.getStoredLanguage() || this.detectLanguage();
    this.translations = {};
    this.supportedLanguages = ['fi', 'en', 'de', 'fr'];
    this.defaultLanguage = 'fi';
    
    this.init();
  }

  init() {
    console.log('Initializing i18n with language:', this.currentLang);
    this.setupLanguageSwitcher(); // Set up switcher first
    this.loadTranslations();
    this.updateHreflangTags();
    this.translatePage();
  }

  getStoredLanguage() {
    return localStorage.getItem('preferred-language');
  }

  setStoredLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
  }

  detectLanguage() {
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
    try {
      const response = await fetch(`/translations/${this.currentLang}.json`);
      this.translations = await response.json();
    } catch (error) {
      console.warn(`Failed to load translations for ${this.currentLang}, using fallback`);
      // Load default language as fallback
      try {
        const fallbackResponse = await fetch(`/translations/${this.defaultLanguage}.json`);
        this.translations = await fallbackResponse.json();
      } catch (fallbackError) {
        console.error('Failed to load any translations');
      }
    }
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
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translated = this.translate(key);
      
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
    
    // Remove any existing switcher first
    const existingSwitcher = document.querySelector('.language-switcher');
    if (existingSwitcher) {
      existingSwitcher.remove();
    }
    
    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.8);
      padding: 8px;
      border-radius: 8px;
      backdrop-filter: blur(10px);
    `;
    
    this.supportedLanguages.forEach(lang => {
      const langBtn = document.createElement('button');
      langBtn.className = `lang-btn ${lang === this.currentLang ? 'active' : ''}`;
      langBtn.innerHTML = this.getLanguageFlag(lang);
      langBtn.setAttribute('title', this.getLanguageName(lang));
      langBtn.style.cssText = `
        background: transparent;
        border: 2px solid #FFD700;
        color: #FFD700;
        padding: 8px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 6px;
        min-width: 44px;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      `;
      
      langBtn.addEventListener('click', () => this.switchLanguage(lang));
      switcher.appendChild(langBtn);
    });

    // Always append to body to ensure it's visible
    document.body.appendChild(switcher);
    console.log('Language switcher created and appended to body');
  }

  getLanguageFlag(lang) {
    const flags = {
      'fi': '🇫🇮',
      'en': '🇺🇸',
      'de': '🇩🇪',
      'fr': '🇫🇷'
    };
    return flags[lang] || lang;
  }

  getLanguageName(lang) {
    const names = {
      'fi': 'Suomi',
      'en': 'English',
      'de': 'Deutsch',
      'fr': 'Français'
    };
    return names[lang] || lang;
  }

  switchLanguage(newLang) {
    if (newLang === this.currentLang) return;

    this.currentLang = newLang;
    this.setStoredLanguage(newLang);
    
    // Update URL
    const currentPath = window.location.pathname;
    const newPath = this.updatePathForLanguage(currentPath, newLang);
    
    if (newPath !== currentPath) {
      window.location.href = newPath;
    } else {
      this.loadTranslations().then(() => {
        this.translatePage();
        this.updateHreflangTags();
      });
    }
  }

  updatePathForLanguage(path, lang) {
    // Remove existing language prefix
    let cleanPath = path.replace(/^\/[a-z]{2}\//, '/');
    if (cleanPath === '/') cleanPath = '';
    
    // Add new language prefix (except for default language)
    if (lang === this.defaultLanguage) {
      return cleanPath || '/';
    } else {
      return `/${lang}${cleanPath}`;
    }
  }

  updateHreflangTags() {
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(tag => tag.remove());
    
    // Add new hreflang tags
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/';
    
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

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing i18n...');
  window.i18n = new I18n();
});

// Also try to initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  console.log('DOM still loading, waiting...');
} else {
  console.log('DOM already loaded, initializing i18n immediately...');
  window.i18n = new I18n();
} 