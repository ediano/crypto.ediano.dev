import { i18n, Locale } from '@/config/i18n.config';

export const getUrl = (uri: string) => {
  return new URL(uri, process.env.NEXT_PUBLIC_APP_URI!).toString();
};

type GetUrlLocaleType = {
  [key in Locale]: string;
};

export const getUrlLocale = (uri = ''): GetUrlLocaleType => {
  const data = i18n.locales.reduce((results, locale) => {
    return { ...results, [locale]: locale + uri };
  }, {} as GetUrlLocaleType);

  return data;
};
