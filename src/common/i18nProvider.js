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
        name: 'Name',
        topicKey: 'Topic Key',
        welcomeText: 'Welcome Text',
        image: 'Image',
        fallbackTopicLevel: 'Fallback Topic Level',
        updatedAt: 'Updated',
        language: 'Language',
        editor: 'Editor',
        level: 'Level',
        qnaApiVersion: 'QNA API version',
        qnaKnowledgeBaseId: 'QNA Knowledgebase ID',
        fk_parentTopicId: 'Parent topic',
        syncScheduled: 'Sync scheduled',
        lastSyncAt: 'Last sync at',
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
    questions: {
      name: 'Question |||| Questions',
      fields: {
        text: 'Text',
        fk_editorId: 'Editor',
        fk_languageId: 'Language',
        fk_topicId: 'Topic',
        fk_answerId: 'Answer',
        fk_parentQuestionId: 'Parent Question',
        fk_questionId: 'Related Question',
        approved: 'Approved',
        feedbackPositiveCount: 'Pos. Feedback',
        feedbackNegativeCount: 'Neg. Feedback',
        updatedAt: 'Updated',
        useAsSuggestion: 'Suggestion',
      },
    },
    answers: {
      name: 'Answer |||| Answers',
      fields: {
        text: 'Text',
        spokenText: 'Spoken txt',
        fk_editorId: 'Editor',
        fk_languageId: 'Language',
        fk_topicId: 'Topic',
        updatedAt: 'Updated',
        approved: 'Approved',
        tags: 'Tags',
      },
    },
    sources: {
      name: 'Source |||| Sources',
      fields: {
        text: 'Text',
        fk_languageId: 'Language',
        updatedAt: 'Updated',
      },
    },
    sessions: {
      name: 'Session |||| Sessions',
      fields: {
        fk_languageId: 'Language',
        fk_topicId: 'Topic',
        duration: 'Duration',
        questionsCount: '# of questions',
        answersCount: '# of answers',
        updatedAt: 'Updated',
        clientCountry: 'Country',
        demoCode: 'Demo code',
      },
    },
    users: {
      name: 'User |||| Users',
      fields: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        lastLogin: 'Last login',
        createdAt: 'Created at',
        created_by: 'Created by',
        isAdmin: 'Admin',
        isActive: 'Active',
        related_groups: 'Related groups',
      },
    },
    groups: {
      name: 'Group |||| Groups',
      fields: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
      },
    },
  },
};

const i18nProvider = polyglotI18nProvider(() => english,
  'en');

export default i18nProvider;
