'use client';
import { Locale } from '@/config/i18n.config';

import { defaultDictionary } from '@/dictionaries/default-dictionaries';
import { dictionaries } from './dictionaries';

export const getDictionaryUseClient = async (locale: Locale) => {
  const defaultDict = defaultDictionary[locale] ?? defaultDictionary['en-US'];
  const dicts = dictionaries[locale] ?? dictionaries['en-US'];

  return { ...defaultDict, ...dicts };
};
