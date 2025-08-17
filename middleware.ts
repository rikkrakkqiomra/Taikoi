import createMiddleware from 'next-intl/middleware';
import { locales } from './src/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Always redirect to locale prefix
  localePrefix: 'always',
  
  // Don't use locale detection
  localeDetection: false
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fi|es|nl|en|de|fr)/:path*']
};
