import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AutoLegal MicroSaaS',
  description:
    'Generate legal documents automatically for your Micro-SaaS projects. Privacy policies, terms of service, and more — powered by AI.',
  keywords: ['legal', 'micro-saas', 'document generator', 'privacy policy', 'terms of service'],
  openGraph: {
    title: 'AutoLegal MicroSaaS',
    description: 'Generate legal documents automatically for your Micro-SaaS projects.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
