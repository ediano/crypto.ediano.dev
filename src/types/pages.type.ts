import { Locale } from '@/config/i18n.config';

export type DefaultPageProps = {
  params: { locale: Locale };
};

export type DefaultLayoutProps = {
  children: React.ReactNode;
  params: { locale: Locale };
};
