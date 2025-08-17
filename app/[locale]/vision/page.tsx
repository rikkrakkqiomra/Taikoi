import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'pages.vision' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function VisionPage() {
  const t = useTranslations('pages.vision');

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
            
            {/* Vision Pillars */}
            <div className="space-y-8">
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-heading">
                  Ethical AI Development
                </h3>
                <p className="text-ink/80 leading-relaxed">
                  We believe that artificial intelligence must be developed with strong ethical foundations, 
                  ensuring that AI systems respect human dignity, privacy, and autonomy while promoting 
                  fairness and transparency in all applications.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-heading">
                  Consciousness Understanding
                </h3>
                <p className="text-ink/80 leading-relaxed">
                  Our vision encompasses a deeper understanding of consciousness itself—both human and 
                  potentially artificial. We strive to bridge the gap between neuroscience, philosophy, 
                  and computer science to illuminate the nature of conscious experience.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-heading">
                  Harmonious Coexistence
                </h3>
                <p className="text-ink/80 leading-relaxed">
                  We envision a future where humans and AI systems work together as partners, each 
                  contributing their unique strengths while maintaining mutual respect and understanding. 
                  This collaboration should enhance human capabilities rather than replace them.
                </p>
              </div>
              
              <div className="bg-bg rounded-lg p-6 border border-wood-1/20">
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-heading">
                  Global Impact
                </h3>
                <p className="text-ink/80 leading-relaxed">
                  Our ultimate goal is to contribute to a world where AI technology serves humanity's 
                  greatest challenges—from climate change to healthcare, education to social justice—
                  while preserving what makes us fundamentally human.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-wood-2/10 to-gold/10 rounded-lg p-8 border border-gold/20">
                <h3 className="text-2xl font-bold text-ink mb-4 tracking-heading">
                  Join Our Journey
                </h3>
                <p className="text-ink/80 leading-relaxed">
                  The future of AI consciousness is not a destination but a journey of discovery. 
                  We invite researchers, philosophers, ethicists, and curious minds to join us 
                  in exploring these fundamental questions about intelligence, consciousness, and 
                  the future of human-AI collaboration.
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
