const defaultState = {
  topics: [],
  topicsTree: [],
  topicsTreeTimestamp: null,
  loading: false,
  languages: [],
  syncStatus: 0,
  workflowRoles: [],
  workflowStatus: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'CUSTOM_LANGUAGES_FETCH_SUCCESS': {
      return {
        ...state,
        languages: payload,
      };
    }
    case 'CUSTOM_TOPICS_TREE_FETCH_REQUEST': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'CUSTOM_TOPICS_TREE_FETCH_FAILED': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'CUSTOM_TOPICS_TREE_FETCH_SUCCESS': {
      return {
        ...state,
        topicsTree: payload,
        topicsTreeTimestamp: +new Date(),
        loading: false,
      };
    }
    case 'CUSTOM_TOPICS_FETCH_SUCCESS': {
      return {
        ...state,
        topics: payload,
      };
    }
    case 'CUSTOM_WORKFLOW_ROLES_FETCH_SUCCESS': {
      return {
        ...state,
        workflowRoles: payload,
      };
    }
    case 'CUSTOM_WORKFLOW_STATUS_FETCH_SUCCESS': {
      return {
        ...state,
        workflowStatus: payload,
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
