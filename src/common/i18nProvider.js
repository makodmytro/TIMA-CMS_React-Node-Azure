import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

const english = {
  ...englishMessages,
  appbar: {
    languageSelect: 'Language',

  },
  resources: {
    topics: {
      name: 'Topic |||| Topics',
      fields: {
        fallbackTopicLevel: 'Fallback Topic Level',
        updatedAt: 'Updated',
        language: 'Language',
        editor: 'Editor',
      },
    },
    languages: {
      name: 'Language |||| Languages',
      fields: {
        updatedAt: 'Updated',
        name: 'Name',
        code: 'Code',
        welcomeText: 'Welcome Text',
        welcomeButton: 'Button Text',
      },
    },
  },
};

const i18nProvider = polyglotI18nProvider(() => english,
  'en');

export default i18nProvider;
