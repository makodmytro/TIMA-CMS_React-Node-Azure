import germanMessages from 'ra-language-german';

const german = {
  ...germanMessages,
  appbar: {
    languageSelect: 'Language',
  },
  'My profile': 'My profile',
  'Topic Sync Scheduled': 'Topic Sync Scheduled',
  required: 'Required',
  Days: 'Days',
  Weeks: 'Weeks',
  Months: 'Months',
  From: 'From',
  Until: 'Until',
  'Questions / unanswered': 'Questions / unanswered',
  '# Questions': '# Questions',
  'Questions unanswered': 'Questions unanswered',
  'Questions answered': 'Questions answered',
  'Session average duration': 'Session average duration',
  Duration: 'Duration',
  // notifications
  'The answer and its related questions were updated': 'The answer and its related questions were updated',
  'The answer was updated': 'The answer was updated',
  'The related questions were approved': 'The related questions were approved',
  'The question was created and linked': 'The question was created and linked',
  'The question was updated': 'The question was updated',
  'Failed to create the question': 'Failed to create the question',
  'The answer was linked': 'The answer was linked',
  'The answer has been unlinked': 'The answer has been unlinked',
  'The record has been updated': 'The record has been updated',
  'The media was deleted': 'The media was deleted',
  'The file was uploaded': 'The file was uploaded',
  'The text is empty. Can not play': 'The text is empty. Can not play',
  'Playing audio...': 'Playing audio...',
  'Failed to get groups': 'Failed to get groups',
  'Failed to get permissions': 'Failed to get permissions',
  'Saved successfully': 'Saved successfully',
  'Sync scheduled': 'Sync scheduled',
  'Failed to sync': 'Failed to sync',
  'The questions were set as follow up': 'The questions were set as follow up',
  // end notifications
  dialogs: {
    batch_approve: 'Are you sure you want to approve this answer\'s related questions?',
    change_language: 'Changing an answers\'s language will also have an effect its topic and the related question\'s topics',
    confirm_media_delete: 'Are you sure you want to delete this media file?',
    unlink_confirmation: 'Are you sure you want to unlink the answer from the question?',
    change_language_confirmation: 'Changing a question\'s language will also have an effect in the topic',
  },
  misc: {
    advanced: 'Advanced',
    qna: 'QNA',
    actions: 'Actions',
    schedule_sync: 'Schedule sync',
    manage_permissions: 'Manage permissions',
    show_questions: 'Show questions',
    show_qr_code: 'Show QR code',
    print: 'Print',
    qr_code: 'QR code',
    columns: 'COLUMNS',
    columns_config: 'Configure visible columns',
    ok: 'OK',
    back: 'Back',
    none: 'None',
    text: 'Text',
    both: 'Both',
    batch_approve: 'Approve questions',
    change_language: 'Change language',
    only_approved_questions: 'Only approved questions',
    only_not_approved_questions: 'Only not-approved questions',
    search: 'Search',
    search_filters_explanations: 'Use the filters to search for questions',
    no_records: 'No records were found',
    undo_change: 'Undo change',
    delete_media: 'Delete media',
    type: 'Type',
    view: 'View',
    uploading: 'Uploading',
    upload: 'Upload',
    loading: 'Loading',
    close: 'Close',
    clear: 'Clear',
    cancel: 'Cancel',
    un_ignore: 'Un-ignore',
    ignore: 'Ignore',
    unlink_answer: 'Unlink answer',
    link_answer: 'Link answer',
    view_related_answer: 'View related answer',
    unanswered_questions: 'Unanswered questions',
    choose_one_option: 'Please choose one of the options',
    search_for: 'Search for',
    questions: 'Questions',
    answers: 'Answers',
    answer: 'Answer',
    link: 'Link',
    confirm: 'Confirm',
    search_questions_answers: 'Use the filters to search for answers or questions',
    search_questions_answers_link: 'Search questions/answers to create link',
    proceed: 'Proceed',
    create: 'Create',
    users: 'Users',
    groups: 'Groups',
    password_must_change: 'Must be changed after first login',
    password_mismatch: 'Password does not match',
    test: 'Test',
    active_sessions: 'Active sessions',
    past_sessions: 'Past sessions',
    topics: 'Topics',
    sessions_map: 'Sessions map',
    edit_topic: 'Edit topic',
  },
  resources: {
    topics: {
      name: 'Topic |||| Topics',
      filter_by_topics: 'Filter by topics',
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
        qnaApiEndpoint: 'QNA API endpoint',
        qnaApiVersion: 'QNA API version',
        qnaKnowledgeBaseId: 'QNA Knowledgebase ID',
        qnaSubscriptionKey: 'QNA Subscription key',
        fk_parentTopicId: 'Parent topic',
        syncScheduled: 'Sync scheduled',
        lastSyncAt: 'Last sync at',
        qnaMetadataKey: 'Metadata key',
        qnaMetadataValue: 'Metadata value',
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
      create: 'Create question',
      edit: 'Edit question',
      link: 'Link to answer',
      no_related: 'There are no related questions',
      no_followup: 'There are no follow up questions',
      use_as_suggestion: 'Use as suggestion',
      topic_mismatch: 'Topics mismatch',
      topic_mismatch_bis: 'The selected record is linked to topic "%{a}". Linking will change the question\'s topic. Proceed?',
      topic_mismatch_explanation: 'The question is related to topic "%{a}" but the answer\'s topic is "%{b}".',
      topic_mismatch_option_a: '1. Update the question and move it to the same topic as the answer (both "%{a}")',
      topic_mismatch_option_b: '2. Duplicate the answer with topic "%{b}" and link it with the question',
      update: 'Update the question',
      set_as_child: 'Set as child',
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
        all_topics: 'All topics',
        ignored: 'Ignored',
      },
    },
    answers: {
      name: 'Answer |||| Answers',
      link_questions: 'Link answer for %{val} questions',
      set_followup: 'Set %{val} questions as followup',
      no_media: 'There is no media for this answer',
      upload_media: 'Upload new file',
      related_questions: 'Related questions',
      followup_questions: 'Followup questions',
      search_questions: 'Search questions to create link',
      media: 'Media',
      edit: 'Edit answer',
      create: 'Create answer',
      duplicate: 'Duplicate the answer',
      fields: {
        text: 'Text',
        spokenText: 'Spoken txt',
        fk_editorId: 'Editor',
        fk_languageId: 'Language',
        fk_topicId: 'Topic',
        fk_questionId: 'Question',
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
      chat_view: 'Enable chat view',
      no_results: 'No sessions were found for the selected period',
      fields: {
        fk_languageId: 'Language',
        from: 'From',
        to: 'To',
        country: 'Country',
        fk_topicId: 'Topic',
        duration: 'Duration',
        questionsCount: '# of questions',
        answersCount: '# of answers',
        updatedAt: 'Updated',
        createdAt: 'Created',
        clientCountry: 'Country',
        demoCode: 'Demo code',
        timestamp: 'Created',
        topicName: 'Topic',
        questionText: 'Question',
        answerText: 'Answer',
        score: 'Score',
      },
    },
    users: {
      name: 'User |||| Users',
      change_password: 'Change password',
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
        password: 'Password',
        password_confirm: 'Password confirm',
      },
    },
    groups: {
      name: 'Group |||| Groups',
      select_user: 'Select the groups the user belongs to',
      select_users_bis: 'Select the users to be added to this group',
      fields: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
      },
    },
  },
};

export default german;
