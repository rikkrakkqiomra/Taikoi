'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { key: 'research', href: `/${locale}/research` },
    { key: 'contact', href: `/${locale}/contact` },
    { key: 'vision', href: `/${locale}/vision` },
  ];

  return (
    <header 
      className="sticky top-0 z-50 bg-bg/95 backdrop-blur-sm border-b border-wood-1/20"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className="header-logo flex-shrink-0"
            aria-label="Aivoinko Machine Metaphysics - Home"
          >
            <picture>
              <source 
                srcSet="/images/logo.avif" 
                type="image/avif" 
                width="48" 
                height="48"
              />
              <source 
                srcSet="/images/logo.webp" 
                type="image/webp" 
                width="48" 
                height="48"
              />
              <Image
                src="/images/logo.svg"
                alt="Aivoinko Machine Metaphysics Logo"
                width={48}
                height={48}
                className="w-12 h-12 md:w-16 md:h-16"
                priority
                decoding="async"
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" role="navigation" aria-label="Main navigation">
            <ul className="flex space-x-8">
              {navItems.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-ink hover:text-wood-2 focus:text-wood-2 transition-colors duration-200 font-medium tracking-heading"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-ink hover:text-wood-2 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="md:hidden py-4 border-t border-wood-1/20"
            role="navigation" 
            aria-label="Mobile navigation"
          >
            <ul className="space-y-2">
              {navItems.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="block px-4 py-2 text-ink hover:text-wood-2 hover:bg-wood-1/10 rounded-md transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
