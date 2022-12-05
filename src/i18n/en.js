import englishMessages from 'ra-language-english';

const english = {
  ...englishMessages,
  appbar: {
    languageSelect: 'Language',
  },
  Test: 'Test',
  Dashboard: 'Dashboard',
  'My profile': 'My profile',
  'Topic Sync Scheduled': 'Topic Sync Scheduled',
  'Topic sync in progress': 'Topic sync in progress',
  required: 'Required',
  Days: 'Days',
  Weeks: 'Weeks',
  Months: 'Months',
  From: 'From',
  To: 'To',
  Until: 'Until',
  'Questions / unanswered': 'Questions / unanswered',
  '# Questions': '# Questions',
  'Questions unanswered': 'Questions unanswered',
  'Questions answered': 'Questions answered',
  'Session average duration': 'Session average duration',
  Duration: 'Duration',
  Required: 'Required',
  // notifications
  'The answer was created successfully': 'The answer was created successfully',
  'We could not execute the action': 'We could not execute the action',
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
  'Topic created successfully': 'Topic created successfully',
  'The questions were set as follow up': 'The questions were set as follow up',
  'Comment added successfully': 'Comment added successfully',
  'Deleted successfully': 'Deleted successfully',
  'Are you sure you want to delete the permission?': 'Are you sure you want to delete the permission?',
  'The error was reported successfully': 'The error was reported successfully',
  // end notifications
  dialogs: {
    batch_approve: 'Are you sure you want to approve this answer\'s related questions?',
    change_language: 'Changing an answers\'s language will also have an effect its topic and the related question\'s topics',
    confirm_media_delete: 'Are you sure you want to delete this media file?',
    unlink_confirmation: 'Are you sure you want to unlink the answer from the question?',
    change_language_confirmation: 'Changing a question\'s language will also have an effect in the topic',
  },
  misc: {
    bug_report_success: 'Thank you for reporting this issue. A ticket was created with ID',
    azure_login: 'Login with Microsoft',
    login: 'login',
    or: 'or',
    azure_403: 'Your user has not been activated for this application, please contact support',
    search_create_questions: 'Search for existing question and link or create a new question',
    save: 'Save',
    add: 'Add',
    advanced: 'Advanced',
    qna: 'QNA',
    next: 'Next',
    actions: 'Actions',
    schedule_sync: 'Request sync',
    manage_permissions: 'Manage permissions',
    show_questions: 'Show questions',
    show_answers: 'Show answers',
    show_qr_code: 'Show QR code',
    print: 'Print',
    qr_code: 'QR code',
    columns: 'COLUMNS',
    columns_config: 'Configure visible columns',
    ok: 'OK',
    back: 'Back',
    none: 'None',
    all: 'All',
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
    delete_user: 'Delete user',
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
    unlink: 'Unlink',
    unlink_answer: 'Unlink answer',
    link_answer: 'Link answer',
    view_related_answer: 'View related answer',
    view_answer: 'view answer',
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
    search_answers_link: 'Search answers to create a link',
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
    edit_topic: 'Edit',
    view_topic: 'View',
    can_not_change_status: 'The status cannot be changed by your current role',
    can_not_change_status_context: 'The status cannot be changed for context only content',
    add_comment: 'Add comment',
    remove: 'Remove',
    search_users: 'Type to search for users',
    editing_answer: 'Editing answer',
    filters: 'Filters',
    already_linked: 'Already linked to this Answer',
    to_confirm: 'to confirm',
    you_will_lose: 'You will permanently lose',
    processing: 'Processing',
    done: 'Done',
    delete: 'Delete',
    self_deactivation: 'You can not deactivate / remove the admin status to yourself',
    delete_kb: 'Remove content from QnA Maker Knowledge Base',
    match_found: 'Match found',
    yes: 'Yes',
    no: 'No',
    test_ask: 'Test ask',
    answer_id: 'Answer ID',
    question_id: 'Question ID',
    topic_id: 'Topic ID',
    request_time_seconds: 'Request time (seconds)',
    suggestions: 'Suggestions',
    score: 'Score',
    steps: 'Steps',
    bug_report: 'Bug report',
    bug_report_text: 'Please describe the problem with as much details as possible',
    submit: 'Submit',
  },
  resources: {
    topics: {
      name: 'Topic |||| Topics',
      filter_by_topics: 'Filter by topics',
      create_child: 'Create child',
      delete_cascade_one: 'all related questions',
      delete_cascade_two: 'all related answers',
      delete_cascade_three: 'all related permissions',
      delete_cascade_four: 'all content on the QnA Maker KB as well',
      delete: 'Delete topic',
      steps: {
        basic: 'Basic information',
        parent: 'Parent topic',
        kb_integration: 'KB integration',
        qna: 'Knowledge Base settings',
        group: 'Related Group',
      },
      kbIntegration: {
        microsoft_qna_maker: 'Microsoft QnA Maker',
        amazon_lex: 'Amazon Lex (not enabled)',
        gpt3: 'GPT3 Questions API (not enabled)',
      },
      permissions: {
        group: 'Group',
        view: 'View',
        edit: 'Edit',
        manage: 'Manage',
        delete: 'Delete',
        no_permissions: 'This topic has no permissions yet',
        all_assigned: 'All the groups are already assigned',
        create_new: 'Create new permission',
        manage_permissions: 'Manage permissions',
      },
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
        has_fk_parentTopicId: 'Has parent',
        syncScheduled: 'Sync scheduled',
        lastSyncAt: 'Last sync at',
        qnaMetadataKey: 'Metadata key',
        qnaMetadataValue: 'Metadata value',
        kbIntegration: 'KB Integration',
        startSync: 'Pull data from QNA now?',
        fk_managedByGroupId: 'Managed by group',
        qnaEndpointKey: 'QNA endpoint key',
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
      followup: 'Followup',
      use_as_suggestion: 'Use as suggestion',
      topic_mismatch: 'Topics mismatch',
      topic_mismatch_bis: 'The selected record is linked to topic "%{a}". Linking will change the question\'s topic. Proceed?',
      topic_mismatch_explanation: 'The question is related to topic "%{a}" but the answer\'s topic is "%{b}".',
      topic_mismatch_option_a: '1. Update the question and move it to the same topic as the answer (both "%{a}")',
      topic_mismatch_option_b: '2. Duplicate the answer with topic "%{b}" and link it with the question',
      update: 'Update the question',
      set_as_child: 'Set as child',
      no_results: 'No questions were found, click "Create" to add a new question',
      duplicated: 'Duplicated question',
      fields: {
        text: 'Text',
        fk_userId: 'Created By',
        fk_createdByUserId: 'Created By',
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
        status: 'Status',
        contextOnly: 'Context only',
        context: 'Context',
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
      related_questions_no_remove: 'The answer can not be unlinked',
      followup_questions: 'Followup questions',
      search_questions: 'Search questions to create link',
      media: 'Media',
      edit: 'Edit answer',
      create: 'Create answer',
      duplicate: 'Duplicate the answer',
      add_related_question: 'Add related question',
      status_history: 'Status history',
      status_can_not_change: 'The status can not be changed',
      no_possible_status: 'You cannot edit the answer with the current status: %{status} - please contact the reviewers team',
      allow_edit_false: 'You cannot edit the answer with the current status: %{status} - please change back to editing',
      topic_edit: 'This QnA has follow-up answers, these will also be moved to the desired topic. Please check if this is correct.',
      allow_change_topic_false: 'You cannot change the topic of a follow-up reply independently of the topic of the parent reply. Please also change the topic of the parent answer or re-create this follow-up answer in the desired topic.',
      steps: {
        topic: 'Select topic',
        questions: 'Create questions',
        answer: 'Create the answer',
      },
      status: {
        createdAt: 'Date',
        updatedBy: 'Editor',
        status: 'Status',
        comment: 'Comment',
      },
      fields: {
        filter: 'Answer or Question',
        text: 'Answer Text',
        spokenText: 'Spoken txt',
        fk_userId: 'Created By',
        fk_createdByUserId: 'Created By',
        fk_languageId: 'Language',
        fk_topicId: 'Topic',
        fk_questionId: 'Question',
        updatedAt: 'Updated',
        approved: 'Approved',
        tags: 'Tags',
        status: 'Status',
        isContextOnly: 'Context only',
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
    'stats/sessions': {
      name: 'Session |||| Sessions',
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
      add: 'Add user',
      no_results: 'No records found',
      workflow: {
        role: 'Workflow role',
        roles: {
          EDITOR: 'Editor',
          REVIEWER: 'Reviewer',
        },
        status: {
          EDITING: 'Editing',
          READY_FOR_INTEGRATION: 'Ready for integration',
          CONTENT_APPROVED: 'Content approved',
          REVIEWING: 'Reviewing',
          CONTENT_ERROR: 'Content error',
          INTEGRATION_ERROR: 'Integration error',
          DEPLOYED_ON_TEST: 'Deployed on Test',
          INTEGRATION_TESTS_OK: 'Integration tests passed',
          DEPLOYED_ON_PRODUCTION: 'Deployed on Production',
        },
        errors: {
          MIN_3_QUESTIONS:
            'At least 3 questions are required when creating a new answer',
          MAX_1_PARENT_FOR_CONTEXT_ONLY:
            'This follow up QnA has more than 1 parent. If you set it to "context only", it will be triggered for all parent responses only in context',
        },
      },
      fields: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        lastLogin: 'Last login',
        createdAt: 'Created at',
        updatedAt: 'Updated at',
        created_by: 'Created by',
        isAdmin: 'Admin',
        isActive: 'Active',
        related_groups: 'Related groups',
        password: 'Password',
        password_confirm: 'Password confirm',
        roles: 'Roles',
      },
    },
    groups: {
      name: 'Group |||| Groups',
      select_user: 'Select the groups the user belongs to',
      select_users_bis: 'Select the users to be added to this group',
      remove_user: 'Remove user from the group?',
      users: 'Users in the group',
      add_users: 'Add users',
      add_users_action: 'Add %{n} users to the group',
      fields: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
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
        updatedAt: 'Date',
      },
    },
    import: {
      step_kb: 'step_kb',
      step_qna: 'step_qna',
      step_fetch_knowledgebases: 'step_fetch_knowledgebases',
      step_analyze_submit: 'step_analyze_submit',
      step_process_kb_result: 'step_process_kb_result',
      step_kb_selection_edit: 'step_kb_selection_edit',
      analyze_kb_failed: 'analyze_kb_failed',
      analyze_kb_contact_support: 'analyze_kb_contact_support',
      step_analyze_submit_button: 'step_analyze_submit_button',
      analyzing_kb: 'analyzing_kb',
      error_fetching_knowledgebases: 'error_fetching_knowledgebases',
      create_bulk_topics_failed: 'create_bulk_topics_failed',
      create_bulk_topics_failed_contact_support: 'create_bulk_topics_failed_contact_support',
      metadata_value_label: 'metadata_value_label',
      metadata_value_view_content: 'metadata_value_view_content',
      ready_to_process_single_topic: 'ready_to_process_single_topic',
      metadata_key_label: 'metadata_key_label',
    },
    demos: {
      name: 'Demo |||| Demos',
    },
  },
};

export default english;
