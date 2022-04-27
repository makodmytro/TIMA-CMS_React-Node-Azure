export REACT_APP_BASE_API=https://qnaeditor-backend1.azurewebsites.net/api
export REACT_APP_TIMA_ENVIRONMENT=ENBW
export REACT_APP_SELECT_TOPIC_LEVELS=1
export REACT_APP_TOPICS_TREE_CHILD_COLOR="498ca752"
export REACT_APP_TOPICS_ENABLE_TREE_LIST=1
export QUESTIONS_TREE_CHILD_COLOR="498ca752"
export REACT_APP_QUESTIONS_ENABLE_TREE_LIST=1
export REACT_APP_HIDE_FIELDS_TOPICS="welcomeText,topicImageUrl,topicKey,topicImageUrl"
export REACT_APP_HIDE_MENU_ITEMS="stats/sessions,languages"
export REACT_APP_HIDE_FIELDS_ANSWERS="spokenText,media"
export REACT_APP_HIDE_SPEECH_FIELD=1
export REACT_APP_USE_AZURE_LOGIN=1
export REACT_APP_AZURE_CLIENT_ID=c1e9c1c7-0f6b-4951-a0dd-a6a9d1064b51
export REACT_APP_AZURE_AUTHORITY=https://login.microsoftonline.com/ee920d54-46e4-4e1e-aa99-6d010a689325
export REACT_APP_AZURE_REDIRECT_URI=https://qnaeditor1frontend.z6.web.core.windows.net/
export REACT_APP_AZURE_LOGOUT_REDIRECT_URI=https://qnaeditor1frontend.z6.web.core.windows.net/
export REACT_APP_USE_WORKFLOW=1
yarn run build && rm ~/Documents/cms-build/* -r && cp build/* ~/Documents/cms-build -r