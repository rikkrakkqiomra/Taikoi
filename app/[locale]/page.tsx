import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import LanguagePicker from '@/components/LanguagePicker';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'hero' });

  return {
    title: 'Aivoinko Machine Metaphysics',
    description: t('tagline'),
  };
}

export default function HomePage() {
  const t = useTranslations('hero');

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* Large Logo */}
            <div className="mb-8 flex justify-center">
              <picture>
                <source 
                  srcSet="/images/logo.avif" 
                  type="image/avif" 
                  width="200" 
                  height="200"
                />
                <source 
                  srcSet="/images/logo.webp" 
                  type="image/webp" 
                  width="200" 
                  height="200"
                />
                <Image
                  src="/images/logo.svg"
                  alt="Aivoinko Machine Metaphysics Logo"
                  width={200}
                  height={200}
                  className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 animate-fade-in"
                  priority
                  decoding="async"
                />
              </picture>
            </div>

            {/* Site Title - Hidden visually but available to screen readers */}
            <h1 className="sr-only">Aivoinko Machine Metaphysics</h1>
            
            {/* Tagline */}
            <p className="text-xl md:text-2xl lg:text-3xl text-ink mb-8 leading-relaxed tracking-heading animate-fade-in">
              {t('tagline')}
            </p>

            {/* CTA Button */}
            <button 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-wood-2 to-wood-1 text-bg font-medium rounded-lg hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 animate-scale-up"
              aria-label="Discover more about our research"
            >
              {t('cta')}
            </button>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-wood-1/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Language Picker Section */}
      <LanguagePicker />
      
      {/* Subtle divider */}
      <div className="border-t border-wood-1/20 my-8" />
    </>
  );
}
