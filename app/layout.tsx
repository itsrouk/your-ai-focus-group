import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Your AI Focus Group',
  description:
    'Test your product, brand, or idea with AI-powered synthetic personas. Get honest reactions, Likert-scale ratings, and actionable insights in minutes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: 'var(--paper-bg)' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
