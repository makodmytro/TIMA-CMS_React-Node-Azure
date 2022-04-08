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
  'Comment added successfully': 'Comment added successfully',
  // end notifications
  dialogs: {
    batch_approve: 'Bist du sicher, dass du die mit dieser Antwort verbundenen Fragen bestätigen möchtest?',
    change_language: 'Das Ändern der Sprache einer Antwort wirkt sich auch auf das Thema und die damit verbundenen Fragen aus',
    confirm_media_delete: 'Bist du sicher, dass du diese Mediendatei löschen möchtest?',
    unlink_confirmation: 'Bist du sicher, dass du die Verlinkung von Antwort und Frage entfernen möchtest?',
    change_language_confirmation: 'Das Ändern der Sprache einer Frage wirkt sich auch auf das Thema aus',
  },
  misc: {
    azure_403: 'Your user has not been activated for this application, please contact support',
    search_create_questions: 'Search for existing question and link or create a new question',
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
    all: 'All',
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
    search_answers_link: 'Search answers to create a link',
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
    can_not_change_status: 'The status cannot be changed by your current role',
    add_comment: 'Add comment',
    remove: 'Remove',
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
        fk_userId: 'Ersteller',
        fk_languageId: 'Sprache',
        fk_topicId: 'Thema',
        fk_answerId: 'Antwort',
        fk_parentQuestionId: 'Übergeordnete Frage',
        fk_questionId: 'Verbundene Frage',
        approved: 'Bestätigt',
        feedbackPositiveCount: 'Pos. Feedback',
        feedbackNegativeCount: 'Neg. Feedback',
        updatedAt: 'Aktualisiert',
        useAsSuggestion: 'Vorschlag',
        all_topics: 'Alle Themen',
        ignored: 'Ignored',
        status: 'Status',
      },
      add_related: 'Frage hinzufügen',
      add_followup: 'Folgefrage hinzufügen',
    },
    answers: {
      name: 'Antwort |||| Antworten',
      link_questions: 'Antwort mit %{val} Fragen verlinken',
      set_followup: '%{val} Fragen als Folgefragen festlegen',
      no_media: 'Es gibt keine Dateien für diese Antwort',
      upload_media: ' Neue Datei hochladen',
      related_questions: 'Verbundene Fragen',
      followup_questions: 'Folgefragen',
      search_questions: 'Fragen suchen, um sie zu verlinken',
      media: 'Dateien',
      edit: 'Antwort bearbeiten',
      create: 'Antwort erstellen',
      duplicate: 'Antwort duplizieren',
      status_history: 'Status history',
      status_can_not_change: 'The status can not be changed',
      status: {
        createdAt: 'Date',
        updatedBy: 'Editor',
        status: 'Status',
        comment: 'Comment',
      },
      fields: {
        text: 'Text',
        spokenText: 'Spoken txt',
        fk_userId: 'Ersteller',
        fk_languageId: 'Sprache',
        fk_topicId: 'Thema',
        fk_questionId: 'Frage',
        updatedAt: 'Aktualisiert',
        approved: 'Bestätigt',
        tags: 'Tags',
        status: 'Status',
      },
    },
    sources: {
      name: 'Source |||| Sources',
      fields: {
        text: 'Text',
        fk_languageId: 'Sprache',
        updatedAt: 'Aktualisiert',
      },
    },
    sessions: {
      name: 'Session |||| Sessions',
      chat_view: 'Chat-Ansicht aktivieren',
      no_results: 'Keine Sessions für den ausgewählten Zeitraum gefunden',
      fields: {
        fk_languageId: 'Sprache',
        from: 'Von',
        to: 'Bis',
        country: 'Land',
        fk_topicId: 'Thema',
        duration: 'Dauer',
        questionsCount: '# Fragen',
        answersCount: '# Antworten',
        updatedAt: 'Aktualisiert',
        createdAt: 'Erstellt',
        clientCountry: 'Land',
        demoCode: 'Demo code',
        timestamp: 'Erstellt',
        topicName: 'Thema',
        questionText: 'Frage',
        answerText: 'Antwort',
        score: 'Score',
      },
    },
    users: {
      name: 'Nutzer |||| Nutzer',
      change_password: 'Passwort ändern',
      add: 'Nutzer hinzufügen',
      workflow: {
        role: 'Workflow role',
        roles: {
          EDITOR: 'Editor',
          REVIEWER: 'Reviewer',
        },
        status: {
          EDITING: 'In Bearbeitung',
          READY_FOR_REVIEW: 'Bereit zum Test',
          REVIEWING: 'Überprüfung',
          REVIEWED: 'Redaktionell abgenommen',
          CONTENT_ERROR: 'Contentfehler',
          INTEGRATION_ERROR: 'Integrationfehler',
          DEPLOYED: 'QnA live',
        },
      },
      fields: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        lastLogin: 'Letzter login',
        createdAt: 'Erstellt am',
        created_by: 'Erstellt von',
        isAdmin: 'Admin',
        isActive: 'Active',
        related_groups: 'Related groups',
        password: 'Passwort',
        password_confirm: 'Passwort bestätigen',
      },
    },
    groups: {
      name: 'Gruppen |||| Gruppen',
      select_user: 'Gruppen auswählen, zu denen der Nutzer gehört',
      select_users_bis: 'Nutzer auswählen, die zu der Gruppe hinzugefügt werden sollen',
      remove_user: 'Remove user from the group?',
      users: 'Users in the group',
      fields: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Erstellt am',
        workflowRole: 'Workflow role',
      },
    },
    audit: {
      name: 'Audit |||| Audit',
      actions: {
        1: 'Added',
        2: 'Updated',
        3: 'Deleted',
        4: 'Login',
      },
      fields: {
        fk_userId: 'User',
        entityName: 'Entity',
        actionType: 'Action',
        createdAt: 'Date',
      },
    }
  },
};

export default german;
