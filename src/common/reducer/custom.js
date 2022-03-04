const defaultState = {
  topics: [],
  languages: [],
  syncStatus: 0,
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'CUSTOM_LANGUAGES_FETCH_SUCCESS': {
      return {
        ...state,
        languages: payload,
      };
    }
    case 'CUSTOM_TOPICS_FETCH_SUCCESS': {
      return {
        ...state,
        topics: payload,
      };
    }
    case 'CUSTOM_TOPICS_SYNC_STATUS': {
      return {
        ...state,
        syncStatus: payload,
      };
    }
    default: {
      return state;
    }
  }
};
