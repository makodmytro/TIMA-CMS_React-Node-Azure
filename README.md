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
| REACT_APP_HIDE_FIELDS_ANSWERS | List of comma separated Answer columns to hide in the edit form | "text,fk_languageId" | null | N |
| REACT_APP_HIDE_FIELDS_QUESTIONS | List of comma separated Questions columns to hide in the edit form | "text,fk_languageId" | null | N |
| REACT_APP_HIDE_MENU_ITEMS | List of comma Resource names to hide in the side menu | "topics,languages,users" | null | N |
| REACT_APP_USE_AZURE_LOGIN | Determines if the Azure login is to be when value = "1" | "1" | null | N |
| REACT_APP_AZURE_CLIENT_ID | Azure Client ID | "asdasd-qweqwe-123123-2" | null | When REACT_APP_USE_AZURE_LOGIN=1 |
| REACT_APP_AZURE_AUTHORITY | Azure Authority URL | https://login.microsoftonline.com/d2fbe2cc-08e7-4a9c/ | null | When REACT_APP_USER_AZURE_LOGIN=1 |
| REACT_APP_AZURE_REDIRECT_URI | Azure redirect URL after login. Must be base URL without path | http://localhost:3000 | When REACT_APP_USER_AZURE_LOGIN=1 |
| REACT_APP_HIDE_SPEECH_FIELD | Disable Speed icon [>] everywhere when the variable is set to "1" | "1" | null | N |
| REACT_APP_AZURE_LOGOUT_REDIRECT_URI | Azure redirect URL after logout. | http://localhost:3000 | When REACT_APP_USER_AZURE_LOGIN=1 |
| REACT_APP_USE_WORKFLOW | Enable the Workflow for answers (instead of simple Approved) | "1" | undefined | N |
| REACT_APP_USE_BACKDOOR_LOGIN | Enable the regular login in a different route | "1" | undefined | N |
| REACT_APP_DEFAULT_HOMEPAGE | Defines the page that will be "homepage" | "answers", "questions", "topics", etc | undefined | N |
| REACT_APP_HIDE_IGNORED_UNANSWERED_QUESTIONS | Hides the Ignored and Unaswnered filters for questions | "1" | undefined | N |
| REACT_APP_TOPICS_LEVEL_LABELS | Labels to be displayed in the Topics inputs. Comma separated | "One,Two,Three" | undefined | N |
| REACT_APP_IDLE_TIMEOUT_SECONDS | Timeout in seconds to log the user out when he is idle | 30 | undefined | N |
| REACT_APP_SHOW_QUESTION_FEEDBACK | Shows the question feedback columns in the table | "1" | N | undefined |
| REACT_APP_HIDE_TAGS_INPUT | Hides the tags input from answers | "1" | N | undefined |
