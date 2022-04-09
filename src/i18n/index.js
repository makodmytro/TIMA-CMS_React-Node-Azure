import polyglotI18nProvider from 'ra-i18n-polyglot';
import english from './en';
import german from './de';

const DEFAULT_LANGUAGE = process.env.REACT_APP_DEFAULT_LANGUAGE || 'de';

const _locale = localStorage.getItem('tima-locale') || DEFAULT_LANGUAGE.toLowerCase();

const i18nProvider = polyglotI18nProvider((locale) => {
  if (locale === 'en') {
    return english;
  }

  return german;
}, _locale);

export default i18nProvider;
