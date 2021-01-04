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
        include: ['Language', 'Editor'],
      };
    }
    case 'answers': {
      return {
        include: ['Editor', 'Topic', 'Language'],
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

const resDataProvider = {
  ...dataProvider,
  getOne: async (resource, params) => {
    const { json } = await httpClient(`${baseApi}/${resource}/${params.id}`);

    if (resource === 'sessions') {
      return json;
    }

    return { data: json };
  },
  getList: async (resource, params) => {
    let url = `${baseApi}/${resource}`;
    if (params) {
      const { field, order } = params.sort || {};

      const { q, ...filter } = params.filter || {};

      const { page, perPage } = params.pagination || { page: 1, perPage: 50 };

      const query = {
        limit: perPage,
        offset: (page - 1) * perPage,
        orderBy: field && order ? `${field} ${order}` : null,
        search: q || undefined,
        filter: params.filter && Object.values(filter).length > 0 ? JSON.stringify(filter) : null,
        ...(resource === 'questions' ? { group: 1 } : {}),
        ...getResourceAssociations(resource),
      };

      url += `?${stringify(query)}`;
    }

    const { json } = await httpClient(url);
    if (Array.isArray(json)) {
      return {
        data: json,
        total: json.length,
      };
    }
    return json;
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
      body: JSON.stringify(params.data),
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

  activeSessions: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/stats/sessions/active`);

    return { data: json };
  },
  pastSessions: async (resource = null, params) => {
    const { json } = await httpClient(`${baseApi}/stats/sessions/past?${stringify(params)}`);

    return { data: json };
  },
  topicStats: async (resource = null, params) => {
    const filters = {};

    if (params.fk_languageId) {
      filters.fk_languageId = [params.fk_languageId];
    }

    const { json } = await httpClient(`${baseApi}/stats/topics?filter=${stringify(filters)}`);

    return { data: json };
  },

};

export default resDataProvider;
