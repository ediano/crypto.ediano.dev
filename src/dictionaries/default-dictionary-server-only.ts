import 'server-only';
import { Locale } from '@/config/i18n.config';

import { defaultDictionary } from './default-dictionaries';

export const getDictionaryServerOnly = async (locale: Locale) => {
  return defaultDictionary[locale] ?? defaultDictionary['en-US'];
};
