import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'pages.contact' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ContactPage() {
  const t = useTranslations('pages.contact');

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 tracking-heading">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl text-wood-2 leading-relaxed">
            {t('subtitle')}
          </p>
        </header>

        {/* Content */}
        <article className="prose prose-lg md:prose-xl mx-auto">
          <div className="bg-wood-1/10 rounded-lg p-8 md:p-12 border border-wood-1/20">
            <p className="text-ink leading-relaxed mb-8 text-lg">
              {t('content')}
            </p>
            
            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Research Collaboration
                </h3>
                <p className="text-ink/80 mb-4">
                  Interested in collaborative research projects or academic partnerships.
                </p>
                <div className="text-gold font-medium">
                  research@aivoinko.com
                </div>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  General Inquiries
                </h3>
                <p className="text-ink/80 mb-4">
                  Questions about our work, speaking engagements, or media inquiries.
                </p>
                <div className="text-gold font-medium">
                  info@aivoinko.com
                </div>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Ethics Advisory
                </h3>
                <p className="text-ink/80 mb-4">
                  Seeking guidance on AI ethics or consciousness-related questions.
                </p>
                <div className="text-gold font-medium">
                  ethics@aivoinko.com
                </div>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Technical Support
                </h3>
                <p className="text-ink/80 mb-4">
                  Technical questions about our research methodologies or frameworks.
                </p>
                <div className="text-gold font-medium">
                  support@aivoinko.com
                </div>
              </div>
            </div>

            {/* Response Time Notice */}
            <div className="mt-8 p-4 bg-gold/10 border border-gold/20 rounded-lg">
              <p className="text-ink/80 text-sm text-center">
                We typically respond to inquiries within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
