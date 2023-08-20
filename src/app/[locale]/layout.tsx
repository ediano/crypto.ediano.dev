import '../../styles/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { i18n } from '@/config/i18n.config';
import type { DefaultLayoutProps } from '@/types/pages.type';

import { getDictionaryServerOnly } from './dictionaries/dictionary-server-only';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  const languages = i18n.locales.map((locale) => ({ locale }));
  return languages;
}

export async function generateMetadata({ params }: DefaultLayoutProps): Promise<Metadata> {
  const translation = await getDictionaryServerOnly(params.locale);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URI!),
    title: {
      default: translation.site.name,
      template: `%s | ${translation.site.name}`,
    },
    description: translation.site.description,
    openGraph: {
      title: {
        default: translation.site.name,
        template: `%s | ${translation.site.name}`,
      },
      description: translation.site.description,
    },
  };
}

type RootLayoutProps = DefaultLayoutProps;
export default async function RootLayout({ children, params }: RootLayoutProps) {
  return (
    <html lang={params.locale}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
