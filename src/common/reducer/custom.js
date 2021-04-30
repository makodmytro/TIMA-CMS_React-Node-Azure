const defaultState = {
  topics: [],
  languages: [],
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
    default: {
      return state;
    }
  }
};
