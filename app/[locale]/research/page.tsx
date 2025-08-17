import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'pages.research' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ResearchPage() {
  const t = useTranslations('pages.research');

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
            <p className="text-ink leading-relaxed mb-6 text-lg">
              {t('content')}
            </p>
            
            {/* Research Areas */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  AI Ethics Framework
                </h3>
                <p className="text-ink/80">
                  Developing comprehensive ethical guidelines for AI development and deployment.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Consciousness Studies
                </h3>
                <p className="text-ink/80">
                  Investigating the nature of consciousness in both biological and artificial systems.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Machine Learning Philosophy
                </h3>
                <p className="text-ink/80">
                  Exploring philosophical implications of machine learning and artificial intelligence.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-xl font-bold text-ink mb-4 tracking-heading">
                  Human-AI Interaction
                </h3>
                <p className="text-ink/80">
                  Studying optimal ways for humans and AI systems to collaborate and coexist.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
