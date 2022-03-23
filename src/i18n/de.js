import germanMessages from 'ra-language-german';

const german = {
  ...germanMessages,
  appbar: {
    languageSelect: 'Sprache',
  },
  'My profile': 'Mein Profil',
  'Topic Sync Scheduled': 'Topic Sync Scheduled',
  required: 'Erforderlich',
  Days: 'Tag',
  Weeks: 'Woche',
  Months: 'Monat',
  From: 'Von',
  Until: 'Bis',
  'Questions / unanswered': 'Fragen / unbeantwortet',
  '# Questions': '# Fragen',
  'Questions unanswered': 'Fragen unbeantwortet',
  'Questions answered': 'Fragen beantwortet',
  'Session average duration': 'Durchschnittliche Session Dauer',
  Duration: 'Dauer',
  // notifications
  'The answer and its related questions were updated': 'Die Antwort und die damit verbundenen Fragen wurden aktualisiert',
  'The answer was updated': 'Die Antwort wurde aktualisiert',
  'The related questions were approved': 'Die verbundenen Fragen wurden bestätigt',
  'The question was created and linked': 'Die Frage wurde erstellt und verlinkt',
  'The question was updated': 'Die Frage wurde aktualisiert',
  'Failed to create the question': 'Die Frage konnte nicht erstellt werden',
  'The answer was linked': 'Die Antwort wurde verlinkt',
  'The answer has been unlinked': 'Die Verlinkung der Antwort wurde entfernt',
  'The record has been updated': 'Der Eintrag wurde aktualisiert',
  'The media was deleted': 'Die Datei wurde gelöscht',
  'The file was uploaded': 'Die Datei wurde hochgeladen',
  'The text is empty. Can not play': 'Das Textfeld ist leer. Es kann nichts abgespielt werden.',
  'Playing audio...': 'Audio Wiedergabe...',
  'Failed to get groups': 'Gruppierung nicht möglich',
  'Failed to get permissions': 'Keine Berechtigung vorhanden',
  'Saved successfully': 'Speichern erfolgreich',
  'Sync scheduled': 'Sync scheduled',
  'Failed to sync': 'Failed to sync',
  'The questions were set as follow up': 'Die Fragen wurden als Folgefragen erstellt',
  // end notifications
  dialogs: {
    batch_approve: 'Bist du sicher, dass du die mit dieser Antwort verbundenen Fragen bestätigen möchtest?',
    change_language: 'Das Ändern der Sprache einer Antwort wirkt sich auch auf das Thema und die damit verbundenen Fragen aus',
    confirm_media_delete: 'Bist du sicher, dass du diese Mediendatei löschen möchtest?',
    unlink_confirmation: 'Bist du sicher, dass du die Verlinkung von Antwort und Frage entfernen möchtest?',
    change_language_confirmation: 'Das Ändern der Sprache einer Frage wirkt sich auch auf das Thema aus',
  },
  misc: {
    save: 'Speichern',
    advanced: 'Erweitert',
    qna: 'QNA',
    actions: 'Aktionen',
    schedule_sync: 'Schedule sync',
    manage_permissions: 'Berechtigungen verwalten',
    show_questions: 'Zeige Fragen',
    show_qr_code: 'Zeige QR Code',
    print: 'Drucken',
    qr_code: 'QR Code',
    columns: 'Spalten',
    columns_config: 'Sichtbare Spalten anpassen',
    ok: 'OK',
    back: 'Zurück',
    none: 'None',
    text: 'Text',
    both: 'Beides',
    batch_approve: 'Fragen bestätigen',
    change_language: 'Sprache ändern',
    only_approved_questions: 'Nur bestätigte Fragen',
    only_not_approved_questions: 'Nur unbestätigte Fragen',
    search: 'Suche',
    search_filters_explanations: 'Verwende die Filter, um Fragen zu suchen',
    no_records: 'Keine Einträge gefunden',
    undo_change: 'Änderung rückgängig machen',
    delete_media: 'Datei löschen',
    type: 'Typ',
    view: 'Ansicht',
    uploading: 'Hochladen',
    upload: 'Hochladen',
    loading: 'Laden',
    close: 'Schließen',
    clear: 'Alles löschen',
    cancel: 'Abbrechen',
    un_ignore: 'Ignorieren aufheben',
    ignore: 'Ignorieren',
    unlink_answer: 'Verlinkung der Antwort entfernen',
    link_answer: 'Antwort verlinken',
    view_related_answer: 'Zeige verbundene Antwort',
    unanswered_questions: 'Unbeantwortete Fragen',
    choose_one_option: 'Bitte wähle eine der Optionen',
    search_for: 'Suche nach',
    questions: 'Fragen',
    answers: 'Antworten',
    answer: 'Antwort',
    link: 'Link',
    confirm: 'Bestätigen',
    search_questions_answers: 'Verwende die Filter, um Fragen oder Antworten zu suchen',
    search_questions_answers_link: 'Suche Fragen/ Antworten um sie zu verlinken',
    proceed: 'Weiter',
    create: 'Erstellen',
    users: 'Nutzer',
    groups: 'Gruppen',
    password_must_change: 'Muss nach der ersten Anmeldung geändert werden',
    password_mismatch: 'Passwort stimmt nicht überein',
    test: 'Test',
    active_sessions: 'Aktive Sessions',
    past_sessions: 'Vergangene Sessions',
    topics: 'Themen',
    sessions_map: 'Sessions Karte',
    edit_topic: 'Thema bearbeiten',
  },
  resources: {
    topics: {
      name: 'Thema |||| Themen',
      filter_by_topics: 'Nach Themen filtern',
      fields: {
        name: 'Name',
        topicKey: 'Themen ID',
        welcomeText: 'Begrüßungstext',
        image: 'Bild',
        fallbackTopicLevel: 'Fallback Topic Level',
        updatedAt: 'Aktualisiert',
        language: 'Sprache',
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
      name: 'Sprache |||| Sprachen',
      fields: {
        updatedAt: 'Aktualisiert',
        name: 'Name',
        code: 'Code',
        welcomeText: 'Begrüßungstext',
        welcomeButton: 'Button Text',
      },
    },
    questions: {
      name: 'Frage |||| Fragen',
      create: 'Frage erstellen',
      edit: 'Fragen bearbeiten',
      link: 'Mit Antwort verbinden',
      no_related: 'Keine verbundenen Fragen vorhanden',
      no_followup: 'Keine Folgefragen vorhanden',
      use_as_suggestion: 'Als Vorschlag nutzen',
      topic_mismatch: 'Thema stimmt nicht überein',
      topic_mismatch_bis: 'Der ausgewählte Eintrag ist mit Thema "%{a}" verbunden. Durch die Verlinkung wird das Thema der Frage geändert. Fortfahren?',
      topic_mismatch_explanation: 'Die Frage bezieht sich auf das Thema "%{a}" aber das Thema der Antwort ist "%{b}".',
      topic_mismatch_option_a: '1. Frage aktualisieren und in das Thema der Antwort verschieben (beide "%{a}")',
      topic_mismatch_option_b: '2. Antwort in das Thema "%{b}" duplizieren und mit der Frage verbinden',
      update: 'Frage aktualisieren',
      set_as_child: 'Set as child',
      no_results: 'Keine Fragen gefunden, klicke "Erstellen" um eine neue Frage hinzuzufügen',
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
      add_related: 'Add Question',
      add_followup: 'Add Followup',
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
