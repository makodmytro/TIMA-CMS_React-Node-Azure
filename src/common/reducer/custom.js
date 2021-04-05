const defaultState = {
  topics: [],
};

export default (previousState = defaultState, { type, payload }) => {
  switch (type) {
    case 'CUSTOM_TOPICS_FETCH_SUCCESS': {
      return {
        topics: payload,
      };
    }
    default: {
      return previousState;
    }
  }
};
