'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'fi', name: 'Suomi', icon: 'circle' },
  { code: 'es', name: 'Español', icon: 'triangle' },
  { code: 'nl', name: 'Nederlands', icon: 'square' },
  { code: 'en', name: 'English', icon: 'diamond' },
  { code: 'de', name: 'Deutsch', icon: 'hexagon' },
  { code: 'fr', name: 'Français', icon: 'star' },
] as const;

export default function LanguagePicker() {
  const t = useTranslations('languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isChanging, setIsChanging] = useState(false);

  // Save language preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', locale);
    }
  }, [locale]);

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale || isChanging) return;
    
    setIsChanging(true);
    
    // Replace the locale in the current pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    // Update the HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale;
    }
    
    router.push(newPath);
    
    // Reset changing state after a short delay
    setTimeout(() => setIsChanging(false), 300);
  };

  const renderIcon = (iconType: string) => {
    return <div className={`geo-icon ${iconType}`} aria-hidden="true" />;
  };

  return (
    <section className="py-12" aria-labelledby="language-picker-title">
      <div className="container mx-auto px-4">
        <h2 
          id="language-picker-title" 
          className="text-2xl md:text-3xl font-bold text-center mb-8 text-ink tracking-heading"
        >
          {t('choose')}
        </h2>
        
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          role="group"
          aria-labelledby="language-picker-title"
        >
          {languages.map((language) => {
            const isActive = locale === language.code;
            const isDisabled = isChanging;
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                disabled={isDisabled}
                className={`
                  language-card wood-grain p-6 text-left transition-all duration-200
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  disabled:pointer-events-none
                `}
                aria-pressed={isActive}
                aria-label={`Switch to ${language.name} (${language.code})`}
                type="button"
              >
                <div className="relative z-10 flex items-center justify-between h-full">
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex items-center space-x-3">
                      {renderIcon(language.icon)}
                      <span className="text-sm font-medium text-bg/90 uppercase tracking-wider">
                        {language.code}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-bg mb-1">
                        {t(language.code === 'fi' ? 'finnish' : 
                            language.code === 'es' ? 'spanish' :
                            language.code === 'nl' ? 'dutch' :
                            language.code === 'en' ? 'english' :
                            language.code === 'de' ? 'german' :
                            'french')}
                      </h3>
                      <p className="text-bg/80 text-sm font-medium">
                        {language.name}
                      </p>
                    </div>
                  </div>
                  
                  {isActive && (
                    <div 
                      className="w-3 h-3 bg-gold rounded-full border-2 border-bg" 
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-ink/70">
            Current: <span className="font-medium text-ink">{locale.toUpperCase()}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
