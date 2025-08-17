import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aivoinko.com'),
  title: {
    template: '%s | Aivoinko Machine Metaphysics',
    default: 'Aivoinko Machine Metaphysics'
  },
  description: 'Exploring the intersection of artificial intelligence and human consciousness',
  keywords: ['AI', 'consciousness', 'machine learning', 'ethics', 'metaphysics'],
  authors: [{ name: 'Aivoinko Machine Metaphysics' }],
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aivoinko.com',
    siteName: 'Aivoinko Machine Metaphysics',
    title: 'Aivoinko Machine Metaphysics',
    description: 'Exploring the intersection of artificial intelligence and human consciousness',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aivoinko Machine Metaphysics',
    description: 'Exploring the intersection of artificial intelligence and human consciousness',
  },
  verification: {
    google: 'verification_token_here',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'nonce-{NONCE_TOKEN}'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data:; connect-src 'self';" 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
