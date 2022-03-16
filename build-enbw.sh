export REACT_APP_BASE_API=https://qnaeditor-backend1.azurewebsites.net/api
export TIMA_ENVIRONMENT=ENBW
export REACT_APP_SELECT_TOPIC_LEVELS=1
yarn run build && rm ~/Documents/cms-build/* -r && cp build/* ~/Documents/cms-build -r