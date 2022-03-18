### Environment variables


| Var | Explanation | Example | Default | Required |
|---|---|---|---|---|
| REACT_APP_BASE_API  | API url  | https://demo1-services.tima-online.com/api  | null  | Y |
| REACT_APP_SENTRY_DSN  | Sentry config DSN  | https://560794f5761945a4b4b4b80413a81297@22.ingest.sentry.io/3333  | null  | Y |
| REACT_APP_SELECT_TOPIC_LEVELS  | Determines if the select for Topics in answers/questions is a single input or several depending on Topic children  |  '0' to use multiple selects, anything else to use only 1 select  | '0'  | Y |
| REACT_APP_TOPICS_TREE_CHILD_COLOR  | Base HEX color for Topic child in the list. Must not include # | 498ca752 | '498ca752'  | N |
| REACT_APP_TOPICS_ENABLE_TREE_LIST  | Determines if the Topic list shows the Childs in tree or plain list  | '1' shows tree, '0' plain  | '1'  | N |
| QUESTIONS_TREE_CHILD_COLOR  | Base HEX color for Question child in the list. Must not include # | 498ca752 | '498ca752'  | N |
| REACT_APP_QUESTIONS_ENABLE_TREE_LIST  | Determines if the Questions list shows the Childs in tree or plain list  | '1' shows tree, '0' plain  | '1'  | N |
| REACT_APP_DEFAULT_LANGUAGE  | Defines a default language to load up initially. If the user changes it afterwards the selected user option is respected  | 'de', 'en'  | 'de'  | N |
| REACT_APP_DEFAULT_COLUMNS_ANSWERS | List of comma separated column names to show as default for Answers. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_QUESTIONS | List of comma separated column names to show as default for Questions. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_TOPICS | List of comma separated column names to show as default for Topics. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_LANGUAGES | List of comma separated column names to show as default for Languages. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_SESSIONS | List of comma separated column names to show as default for Sessions. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_USERS | List of comma separated column names to show as default for Users. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_DEFAULT_COLUMNS_GROUPS | List of comma separated column names to show as default for Groups. It takes presedence over the `default-columns.json` file. | "name, fk_languageId" | null | N |
| REACT_APP_HIDE_FIELDS_TOPICS | List of comma separated Topic columns to hide in the edit form | "name,fk_languageId" | null | N |
| REACT_APP_HIDE_MENU_ITEMS | List of comma Resource names to hide in the side menu | "topics,languages,users" | null | N |
