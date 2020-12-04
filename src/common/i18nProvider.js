import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

const english = {
  ...englishMessages,
};

const i18nProvider = polyglotI18nProvider(() => english,
  'en');

export default i18nProvider;
