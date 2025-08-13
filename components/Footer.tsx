/**
 * Footer.tsx — Lean, accessible, responsive footer (Tailwind + i18next)
 *
 * Usage (Next.js + react-i18next):
 *
 * 1) Ensure you have i18next configured with the default Next.js app router or pages router.
 *    Example with app router:
 *      - Install: npm i i18next react-i18next next-i18next
 *      - Place your translation files under `public/locales/{lang}/footer.json`
 *      - Initialize i18next in a shared setup (e.g., app/i18n.ts) and wrap your app with I18nextProvider.
 *
 * 2) Import and use the component:
 *    import Footer from "@/components/Footer";
 *    export default function Layout({ children }: { children: React.ReactNode }) {
 *      return (
 *        <html lang="en">
 *          <body className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-200">
 *            {children}
 *            <Footer />
 *          </body>
 *        </html>
 *      );
 *    }
 *
 * 3) Adding new languages:
 *    - Create `public/locales/{newLang}/footer.json` using the same keys.
 *    - Add the language to your i18next configuration.
 *    - No component code changes required.
 */

import * as React from "react";
import { useTranslation } from "react-i18next";

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function ExternalLink(props: AnchorProps) {
  const { className = "", children, ...rest } = props;
  return (
    <a
      {...rest}
      className={
        "inline-flex items-center gap-2 transition-colors hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 " +
        className
      }
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

function InternalLink(props: AnchorProps) {
  const { className = "", children, ...rest } = props;
  return (
    <a
      {...rest}
      className={
        "inline-flex items-center gap-2 transition-colors hover:text-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 " +
        className
      }
    >
      {children}
    </a>
  );
}

export default function Footer(): JSX.Element {
  const { t } = useTranslation("footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" aria-label="Footer" className="border-t border-neutral-800 bg-neutral-900 text-neutral-200 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <section aria-labelledby="footer-about" className="space-y-4">
            <h2 id="footer-about" className="sr-only">
              {t("contact_us")}
            </h2>
            <div className="flex flex-col gap-2">
              <InternalLink href="/contact" aria-label={t("contact_us")}
                className="text-sm text-neutral-300 hover:text-amber-400">
                <span>{t("contact_us")}</span>
              </InternalLink>
              <InternalLink href="/contact" aria-label={t("partners_investors")}
                className="text-sm text-neutral-300 hover:text-amber-400">
                <span>{t("partners_investors")}</span>
              </InternalLink>
            </div>
            <p className="text-xs text-neutral-400">
              {t("copyright", { year: String(currentYear) })}
            </p>
          </section>

          <nav aria-labelledby="footer-legal" className="md:justify-self-center">
            <h2 id="footer-legal" className="text-sm font-semibold text-neutral-100">
              {t("legal")}
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-300">
              <li>
                <InternalLink href="/privacy">{t("privacy")}</InternalLink>
              </li>
              <li>
                <InternalLink href="/legal/compliance">{t("legal_compliance")}</InternalLink>
              </li>
              <li>
                <InternalLink href="/legal/terms">{t("legal_terms")}</InternalLink>
              </li>
              <li>
                <InternalLink href="/legal/filings">{t("legal_filings")}</InternalLink>
              </li>
              <li>
                <InternalLink href="/do-not-sell">{t("dnsmi")}</InternalLink>
              </li>
              <li>
                <InternalLink href="/cookie-preferences">{t("cookies")}</InternalLink>
              </li>
            </ul>
          </nav>

          <nav aria-label="Social links" className="md:justify-self-end">
            <ul className="flex items-center gap-4">
              <li>
                <ExternalLink
                  href="https://linkedin.com/company/golddiggertech"
                  title={t("linkedin")}
                  aria-label={t("linkedin")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-neutral-300 hover:text-amber-400"
                    role="img"
                    aria-hidden="false"
                    focusable="false"
                  >
                    <title>{t("linkedin")}</title>
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.7-2.2 3.6-2.2 3.8 0 4.5 2.5 4.5 5.7V24h-4v-7.3c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V24h-4V8z" />
                  </svg>
                  <span className="sr-only">{t("linkedin")}</span>
                </ExternalLink>
              </li>
              <li>
                <ExternalLink
                  href="https://x.com/golddiggertech"
                  title={t("x")}
                  aria-label={t("x")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-neutral-300 hover:text-amber-400"
                    role="img"
                    aria-hidden="false"
                    focusable="false"
                  >
                    <title>{t("x")}</title>
                    <path d="M18.244 2H21l-6.5 7.43L22 22h-6.844l-4.77-6.22L4.8 22H2l7.07-8.08L2 2h6.844l4.39 5.78L18.244 2zm-1.2 18h1.96L7.03 4H5.07l11.974 16z" />
                  </svg>
                  <span className="sr-only">{t("x")}</span>
                </ExternalLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}


