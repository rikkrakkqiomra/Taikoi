import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer 
      className="w-full bg-ink py-6"
      role="contentinfo"
    >
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gold text-sm font-medium">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
