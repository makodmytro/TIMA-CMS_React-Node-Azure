import germanMessages from 'ra-language-german';

const german = {
  ...germanMessages,
  appbar: {
    languageSelect: 'Sprache',
  },
  Test: 'Test',
  Dashboard: 'Dashboard',
  'My profile': 'Mein Profil',
  'Topic Sync Scheduled': 'Themen Sync geplant ',
  required: 'Erforderlich',
  Days: 'Tag',
  Weeks: 'Woche',
  Months: 'Monat',
  From: 'Von',
  To: 'Bis',
  Until: 'Bis',
  'Questions / unanswered': 'Fragen / unbeantwortet',
  '# Questions': '# Fragen',
  'Questions unanswered': 'Fragen unbeantwortet',
  'Questions answered': 'Fragen beantwortet',
  'Session average duration': 'Durchschnittliche Session Dauer',
  Duration: 'Dauer',
  Required: 'Erforderlich',
  // notifications
  'The answer was created successfully': 'Die Antwort wurde erstellt',
  'We could not execute the action': 'Die Aktion konnte nicht ausgeführt werden',
  'The answer and its related questions were updated': 'Die Antwort und die verlinkten Fragen wurden aktualisiert',
  'The answer was updated': 'Die Antwort wurde aktualisiert',
  'The related questions were approved': 'Die verlinkten Fragen wurden bestätigt',
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
  'Sync scheduled': 'Sync geplant',
  'Failed to sync': 'Sync nicht möglich',
  'Topic created successfully': 'Thema erfolgreich erstellt',
  'The questions were set as follow up': 'Die Fragen wurden als Folgefragen erstellt',
  'Comment added successfully': 'Kommentar erfolgreich hinzugefügt',
  'Deleted successfully': 'Löschen erfolgreich',
  'Are you sure you want to delete the permission?': 'Bist du dir sicher, dass du diese Berechtigung löschen möchtest?',
  // end notifications
  dialogs: {
    batch_approve: 'Bist du sicher, dass du die mit dieser Antwort verlinkten Fragen bestätigen möchtest?',
    change_language: 'Das Ändern der Sprache einer Antwort wirkt sich auch auf das Thema und die verlinkten Fragen aus',
    confirm_media_delete: 'Bist du sicher, dass du diese Mediendatei löschen möchtest?',
    unlink_confirmation: 'Bist du sicher, dass du die Verlinkung von Antwort und Frage entfernen möchtest?',
    change_language_confirmation: 'Das Ändern der Sprache einer Frage wirkt sich auch auf das Thema aus',
  },
  misc: {
    azure_login: 'Mit Microsoft-Konto einloggen',
    login: 'Login',
    or: 'oder',
    azure_403: 'Der Nutzer wurde nicht aktiviert für diese Anwendung, bitte den Support kontaktieren',
    search_create_questions: 'Suche nach bestehenden Fragen zum Verlinken oder erstelle eine neue Frage',
    save: 'Speichern',
    advanced: 'Erweitert',
    qna: 'QNA',
    next: 'Weiter',
    actions: 'Aktionen',
    schedule_sync: 'Sync anfordern',
    manage_permissions: 'Berechtigungen verwalten',
    show_questions: 'Zeige Fragen',
    show_answers: 'Zeige Antworten',
    show_qr_code: 'Zeige QR Code',
    print: 'Drucken',
    qr_code: 'QR Code',
    columns: 'Spalten',
    columns_config: 'Sichtbare Spalten anpassen',
    ok: 'OK',
    back: 'Zurück',
    none: 'Keine',
    all: 'Alle',
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
    type: 'Type',
    view: 'Ansicht',
    uploading: 'Hochladen',
    upload: 'Hochladen',
    loading: 'Laden',
    close: 'Schließen',
    clear: 'Auswahl aufheben',
    cancel: 'Abbrechen',
    un_ignore: 'Ignorieren aufheben',
    ignore: 'Ignorieren',
    unlink: 'Verlinkung entfernen',
    unlink_answer: 'Verlinkung entfernen',
    link_answer: 'Antwort hinzufügen',
    view_related_answer: 'Zeige verlinkte Antwort',
    view_answer: 'Zeige antwort',
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
    search_answers_link: 'Suche Antworten, um sie zu verlinken',
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
    can_not_change_status: 'Du hast keine Berechtigung den Status zu ändern',
    add_comment: 'Kommentar erstellen',
    remove: 'Entfernen',
    search_users: 'Hier tippen um Nutzer zu suchen',
    editing_answer: 'Antwort bearbeiten',
    filters: 'Filter',
    already_linked: 'Bereits verlinkt',
    to_confirm: 'Bestätigen',
    you_will_lose: 'Dauerhaft verlieren',
    processing: 'Bearbeiten',
    done: 'Erledigt',
    delete: 'Löschen',
    self_deactivation: 'Du kannst den Admin-Status nicht selber deaktivieren/ löschen',
  },
  resources: {
    topics: {
      name: 'Thema |||| Themen',
      filter_by_topics: 'Nach Themen filtern',
      create_child: 'Unterthema hinzufügen',
      delete_cascade_one: 'Alle verlinkten Antworten',
      delete_cascade_two: 'Alle verlinkten Antworten',
      delete_cascade_three: 'Alle zugehörigen Berechtigungen',
      delete: 'Thema löschen',
      steps: {
        basic: 'Thema',
        parent: 'Übergeordnetes Thema',
        kb_integration: 'KB Integration',
        qna: 'Knowledge Base settings',
        group: 'Related Group',
      },
      kbIntegration: {
        microsoft_qna_maker: 'Microsoft QnA Maker',
        amazon_lex: 'Amazon Lex (nicht möglich)',
        gpt3: 'GPT3 Questions API (nicht möglich)',
      },
      permissions: {
        group: 'Gruppe',
        view: 'Ansehen',
        edit: 'Bearbeiten',
        manage: 'Verwalten',
        delete: 'Löschen',
        no_permissions: 'Dieses Thema hat noch keine Berechtigungen',
        all_assigned: 'Alle Gruppen wurden bereits zugewiesen',
        create_new: 'Erstelle eine neue Berechtigung',
        manage_permissions: 'Bearbeite Berechtigungen',
      },
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
        fk_parentTopicId: 'Übergeordnetes Thema',
        has_fk_parentTopicId: 'Übergeordnetes Thema',
        syncScheduled: 'Sync geplant',
        lastSyncAt: 'Letztes Sync am',
        qnaMetadataKey: 'Metadata key',
        qnaMetadataValue: 'Metadata value',
        kbIntegration: 'KB Integration',
        startSync: 'Sollen die Daten jetzt synchronisiert werden?',
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
      name: 'Frage |||| Training',
      create: 'Frage erstellen',
      edit: 'Frage bearbeiten',
      link: 'Mit Antwort verbinden',
      no_related: 'Keine verlinkten Fragen vorhanden',
      no_followup: 'Keine Folgefragen vorhanden',
      use_as_suggestion: 'Als Vorschlag nutzen',
      topic_mismatch: 'Thema stimmt nicht überein',
      topic_mismatch_bis: 'Der ausgewählte Eintrag ist mit Thema "%{a}" verlinkt. Durch die neue Verlinkung wird das Thema der Frage geändert. Fortfahren?',
      topic_mismatch_explanation: 'Die Frage bezieht sich auf das Thema "%{a}" aber das Thema der Antwort ist "%{b}".',
      topic_mismatch_option_a: '1. Frage aktualisieren und in das Thema der Antwort verschieben (beide "%{a}")',
      topic_mismatch_option_b: '2. Antwort in das Thema "%{b}" duplizieren und mit der Frage verbinden',
      update: 'Frage aktualisieren',
      set_as_child: 'Set as child',
      no_results: 'Keine Fragen gefunden, klicke "Erstellen" um eine neue Frage hinzuzufügen',
      duplicated: 'Doppelte Frage',
      fields: {
        text: 'Frage',
        fk_userId: 'Editor',
        fk_createdByUserId: 'Editor',
        fk_languageId: 'Sprache',
        fk_topicId: 'Thema',
        fk_answerId: 'Antwort',
        fk_parentQuestionId: 'Übergeordnete Frage',
        fk_questionId: 'Verlinkte Frage',
        approved: 'Bestätigt',
        feedbackPositiveCount: 'Pos. Feedback',
        feedbackNegativeCount: 'Neg. Feedback',
        updatedAt: 'Aktualisiert',
        useAsSuggestion: 'Vorschlag',
        all_topics: 'Alle Themen',
        ignored: 'Ignoriert',
        status: 'Status',
        contextOnly: 'Nur im Kontext',
      },
      add_related: 'Frage hinzufügen',
      add_followup: 'Folgefrage hinzufügen',
    },
    answers: {
      name: 'Antwort |||| QnA',
      link_questions: 'Antwort mit %{val} Fragen verlinken',
      set_followup: '%{val} Fragen als Folgefragen festlegen',
      no_media: 'Es gibt keine Dateien für diese Antwort',
      upload_media: 'Neue Datei hochladen',
      related_questions: 'Verlinkte Fragen',
      related_questions_no_remove: 'Diese Verlinkung kann nicht entfernt werden',
      followup_questions: 'Folgefragen',
      search_questions: 'Fragen suchen, um sie zu verlinken',
      media: 'Dateien',
      edit: 'Antwort bearbeiten',
      create: 'Antwort erstellen',
      duplicate: 'Antwort duplizieren',
      status_history: 'Statusverlauf',
      status_can_not_change: 'Der Status kann nicht geändert werden',
      no_possible_status: 'Du kannst die Antwort mit dem aktuellen Status nicht bearbeiten: %{status} - bitte kontaktiere das Edison-Team',
      allow_edit_false: 'Du kannst die Antwort mit dem aktuellen Status nicht bearbeiten: %{status} - bitte ändere den Status',
      status: {
        createdAt: 'Datum',
        updatedBy: 'Editor',
        status: 'Status',
        comment: 'Kommentar',
      },
      steps: {
        topic: 'Thema wählen',
        questions: 'Fragen erstellen',
        answer: 'Antwort erstellen',
      },
      fields: {
        filter: 'Text',
        text: 'Antwort',
        spokenText: 'Aussprache',
        fk_userId: 'Editor',
        fk_createdByUserId: 'Editor',
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
    'stats/sessions': {
      name: 'Session |||| Sessions',
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
        score: 'Wert',
      },
    },
    users: {
      name: 'Nutzer |||| Nutzer',
      change_password: 'Passwort ändern',
      add: 'Nutzer hinzufügen',
      no_results: 'Keine Einträge gefunden',
      workflow: {
        role: 'Workflow Berechtigungen',
        roles: {
          EDITOR: 'Editor',
          REVIEWER: 'Reviewer',
        },
        status: {
          EDITING: 'In Bearbeitung',
          READY_FOR_INTEGRATION: 'Integrationsbereit',
          CONTENT_APPROVED: 'Redaktionelle Freigabe',
          CONTENT_ERROR: 'Contentfehler',
          INTEGRATION_ERROR: 'Integrationsfehler',
          DEPLOYED_ON_TEST: 'Auf Test',
          INTEGRATION_TESTS_OK: 'Tests erfolgreich',
          DEPLOYED_ON_PRODUCTION: 'Live',
        },
        errors: {
          MIN_3_QUESTIONS: 'Beim Erstellen einer neuen Antwort sind mindestens 3 Fragen erforderlich',
        },
      },
      fields: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        lastLogin: 'Letzter Login',
        createdAt: 'Erstellt am',
        updatedAt: 'Aktualisiert am',
        created_by: 'Erstellt von',
        isAdmin: 'Admin',
        isActive: 'Aktiv',
        related_groups: 'Zugehörige Gruppen',
        password: 'Passwort',
        password_confirm: 'Passwort bestätigen',
        roles: 'Rollen',
      },
    },
    groups: {
      name: 'Gruppen |||| Gruppen',
      select_user: 'Gruppen auswählen, zu denen der Nutzer gehört',
      select_users_bis: 'Nutzer auswählen, die zu der Gruppe hinzugefügt werden sollen',
      remove_user: 'Nutzer aus der Gruppe entfernen?',
      users: 'Nutzer ist in der Gruppe',
      add_users: 'Nutzer hinzufügen',
      add_users_action: '%{n} Nutzer zu der Gruppe hinzufügen',
      fields: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Erstellt am',
        workflowRole: 'Workflow Berechtigung',
      },
    },
    audit: {
      name: 'Audit |||| Audit',
      actions: {
        1: 'Hinzugefügt',
        2: 'Aktualisiert',
        3: 'Gelöscht',
        4: 'Login',
      },
      fields: {
        fk_userId: 'Nutzer',
        entityName: 'Bereich',
        actionType: 'Aktion',
        createdAt: 'Datum',
        updatedAt: 'Datum',
      },
    },
  },
};

export default german;
