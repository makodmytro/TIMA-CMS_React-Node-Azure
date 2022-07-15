const defaultState = {
  topics: [],
  topicsTree: [],
  topicsLabels: [],
  topicsTreeTimestamp: null,
  loading: false,
  languages: [],
  syncStatus: 0,
  workflowRoles: [],
  workflowStatus: [],
  answers: {
    data: {},
    statusHistory: {},
  },
  navigatedRoutes: [],
};

export default (state = defaultState, { type, payload }) => {
  switch (type) {
    case 'CUSTOM_NAVIGATION_CHANGED': {
      const n = state.navigatedRoutes.concat([payload]);

      return {
        ...state,
        navigatedRoutes: n.slice(Math.max(n.length - 10, 0)),
      };
    }
    case 'CUSTOM_TOPICS_LABELS_SUCCESS': {
      return {
        ...state,
        topicsLabels: payload,
      };
    }
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
    case 'CUSTOM_ANSWER_STATUS_HISTORY': {
      return {
        ...state,
        answers: {
          ...state.answers,
          statusHistory: {
            ...state.answers.statusHistory,
            [payload.id]: payload.data,
          },
        },
      };
    }
    case 'CUSTOM_SET_ANSWER': {
      return {
        ...state,
        answers: {
          ...state.answers,
          data: {
            ...state.answers.data,
            [payload.id]: payload.data,
          },
        },
      };
    }
    default: {
      return state;
    }
  }
};
