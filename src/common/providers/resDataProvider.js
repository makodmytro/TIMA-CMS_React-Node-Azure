/* eslint-disable no-unused-vars */
import pick from 'lodash/pick';
import simpleRestProvider from 'ra-data-simple-rest';
import { stringify } from 'query-string';
import httpClient, { baseApi } from '../httpClient';

const dataProvider = simpleRestProvider(baseApi, httpClient);
const getResourceAssociations = (resource) => {
  switch (resource) {
    case 'questions': {
      return {
        include: ['Answer', 'Language'],
      };
    }
    case 'topics': {
      return {
        include: ['Language'],
      };
    }
    case 'answers': {
      return {
        include: ['Topic', 'Language'],
      };
    }
    case 'stats/sessions': {
      return {
        include: ['Language', 'Topic'],
      };
    }
    default: {
      return {};
    }
  }
};

const cleanBody = (body, resource) => {
  switch (resource) {
    case 'users': {
      const b = pick(body, [
        'isAdmin',
        'isActive',
        'groups',
      ]);

      if (body.password && body.change_password) {
        b.password = body.password;
      }

      return b;
    }
    default: {
      return body;
    }
  }
};

const getListUrl = (initialUrl, resource, params) => {
  let url = initialUrl;

  if (params) {
    const { field, order } = params.sort || {};

    const {
      q, unanswered, groupRelated, topLevelOnly, ...restFilter
    } = params.filter || {};
    const {
      from, to, active, search, ...filter
    } = restFilter;

    if (unanswered) {
      filter.fk_answerId = null;
    }

    if (filter.approved === false || filter.approved === 0) {
      filter.approved = [false, null];
    }

    const { page, perPage } = params.pagination || { page: 1, perPage: 50 };

    const query = {
      limit: perPage,
      offset: (page - 1) * perPage,
      orderBy: field && order ? `${field} ${order}` : null,
      search: q || undefined,
      filter: params.filter && Object.values(filter).length > 0 ? JSON.stringify(filter) : null,
      ...(resource === 'questions' ? { group: 1 } : {}),
      ...(resource === 'demos' && active ? { active: true } : {}),
      ...(resource === 'demos' && search ? { search } : {}),
      ...((resource === 'topics' || resource === 'questions') && topLevelOnly ? { topLevelOnly } : {}),
      ...(params.include ? { include: params.include } : getResourceAssociations(resource)),
    };

    if (from) {
      if (resource === 'audit') {
        query.filter.from = from;
      } else {
        query.from = from;
      }
    }

    if (to) {
      if (resource === 'audit') {
        query.filter.to = to;
      } else {
        query.to = to;
      }
    }

    if (groupRelated) {
      query.groupRelated = 1;
    }

    url += `?${stringify(query)}`;
  }

  return url;
};

const resDataProvider = {
  ...dataProvider,
  getOne: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/${resource}/${params.id}`);

    if (resource === 'sessions') {
      return json;
    }

    if (resource === 'users') {
      json.groups = (json.Groups || []).map((g) => g.id);
    }

    return { data: json };
  },
  getList: async (resource, params) => {
    const url = getListUrl(`${baseApi}/${resource}`, resource, params);

    const { json } = await httpClient(url);

    if (Array.isArray(json)) {
      return {
        data: json,
        total: json.length,
      };
    }

    if (resource === 'users') { // hack "Groups"
      json.data = json.data.map((j) => {
        return {
          ...j,
          groups: (j.Groups || []).map((g) => g.id),
        };
      });
    }

    return {
      data: json.data || [],
      total: json.total || 0,
    };
  },
  getMany: async (resource, params) => {
    const query = {
      filter: params.ids && params.ids.length > 0
        ? JSON.stringify({ id: params.ids }) : null,
    };

    const url = `${baseApi}/${resource}?${stringify(query)}`;

    const { json } = await httpClient(url);
    if (Array.isArray(json)) {
      return {
        data: json,
        total: json.length,
      };
    }
    return json;
  },

  update: async (resource, params) => {
    const url = `${baseApi}/${resource}/${params.id}`;

    await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(cleanBody(params.data, resource)),
    });
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  tts: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/admin/tts`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },

  questionSuggestions: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/questions/${params.id}/suggestions`);

    return { data: json };
  },
  createQuestionAssociation: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/questions/${params.id}/suggestions/${params.parentId}`, {
      method: 'PUT',
    });

    return { data: json };
  },
  deleteQuestionAssociation: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/questions/${params.id}/suggestions/${params.parentId}`, {
      method: 'DELETE',
    });

    return { data: json };
  },

  activeSessions: async (resource = null) => {
    const { json } = await httpClient(`${baseApi}/stats/sessions/active`);

    return { data: json };
  },
  pastSessions: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/stats/sessions/past?${stringify(params)}`);

    return { data: json };
  },
  topicTree: async (resource = null, params) => {
    const url = getListUrl(`${baseApi}/${resource}/tree`, resource, params);

    const { json } = await httpClient(url);

    if (Array.isArray(json)) {
      return {
        data: json,
        total: json.length,
      };
    }

    return json;
  },
  addUsersToGroup: async (resource = null, params) => {
    await httpClient(`${baseApi}/groups/${params.id}/users`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });

    return { data: true };
  },
  topicCreatePermission: async (resource = null, params) => {
    await httpClient(`${baseApi}/topics/${params.topic_id}/permissions/${params.group_id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });

    return { data: true };
  },
  topicDeletePermission: async (resource = null, params) => {
    await httpClient(`${baseApi}/topics/${params.topic_id}/permissions/${params.group_id}`, {
      method: 'DELETE',
    });

    return { data: true };
  },
  topicSync: async (resource = null, params) => {
    await httpClient(`${baseApi}/topics/${params.id}/sync`, {
      method: 'POST',
    });

    return { data: true };
  },
  topicStatus: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/topics/status`, {
      method: 'GET',
    });

    return { data: json };
  },
  topicStats: async (resource = null, params) => {
    const filters = {};

    if (params.filters.fk_languageId) {
      filters.fk_languageId = [params.filters.fk_languageId];
    }

    const { page, perPage: limit } = params.pagination || { page: 1, perPage: 5 };
    const offset = (page - 1) * limit;
    const query = {
      filter: Object.values(filters).length > 0 ? JSON.stringify(filters) : null,
      limit,
      offset,
    };

    const { json } = await httpClient(`${baseApi}/stats/topics?${stringify(query)}`);

    return { data: json };
  },
  sessionsMap: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/stats/sessions/countries`);

    return { data: json };
  },
  answerWorkflow: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/answers/${params.id}/status`);

    return { data: json };
  },
  statusComment: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/answers/${params.id}/status/comment`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });

    return { data: true };
  },
  updateAnswerStatus: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/answers/${params.id}/status/${params.status}`, {
      method: 'PUT',
    });

    return { data: true };
  },
  getAnswerMedia: async (resource, params) => {
    const token = sessionStorage.getItem('token');
    const headers = new Headers({
      Authorization: `Bearer ${token}`,
    });

    const res = await fetch(`${baseApi}/answers/${params.id}/media/${params.mediaId}/download`, {
      headers,
    });
    const blob = await res.blob();

    return { data: blob };
  },
  uploadAnswerMedia: async (resource, params) => {
    const fd = new FormData();
    fd.append('file', params.data.binary);

    await httpClient(`${baseApi}/answers/${params.id}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: fd,
    });

    return { data: true };
  },
  deleteAnswerMedia: async (resource, params) => {
    await httpClient(`${baseApi}/answers/${params.id}/media/${params.mediaId}`, {
      method: 'DELETE',
    });

    return { data: true };
  },
  batchApproveQuestions: async (resource, params) => {
    await httpClient(`${baseApi}/answers/${params.id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved: true }),
    });

    return { data: true };
  },
  answersAddFollowup: async (resource, params) => {
    await httpClient(`${baseApi}/answers/${params.id}/followups/${params.question_id}`, {
      method: 'POST',
    });

    return { data: true };
  },
  answersRemoveFollowup: async (resource, params) => {
    await httpClient(`${baseApi}/answers/${params.id}/followups/${params.question_id}`, {
      method: 'DELETE',
    });

    return { data: true };
  },
  refreshSession: async (resource) => {
    const { json } = await httpClient(`${baseApi}/users/refresh`, {
      method: 'POST',
    });

    const { accessToken, data } = json;

    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('user', JSON.stringify(data));

    return { data: json };
  },
  startSession: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/sessions`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });

    return { data: json };
  },
  ask: async (resource, params) => {
    const { token, ...rest } = params.data;

    const { json } = await httpClient(`${baseApi}/questions/ask`, {
      method: 'POST',
      body: JSON.stringify(rest),
      headers: new Headers({ Authorization: `Bearer ${token}` }),
    }, true);

    return { data: json };
  },
  workflowRoles: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/users/workflow/roles`, {
      method: 'GET',
    });

    return { data: json };
  },
  workflowStatus: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/users/workflow/status`, {
      method: 'GET',
    });

    return { data: json };
  },
};

export default resDataProvider;
