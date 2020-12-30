import simpleRestProvider from 'ra-data-simple-rest';
import httpClient, { baseApi } from '../httpClient';

const dataProvider = simpleRestProvider(baseApi, httpClient);

const resDataProvider = {
  ...dataProvider,
  getList: async (resource) => {
    const url = `${baseApi}/${resource}`;

    const { json } = await httpClient(url);
    return {
      data: json.data,
      total: json.total,
    };
  },

  getMany: async (resource) => {
    const url = `${baseApi}/${resource}`;

    const { json } = await httpClient(url);
    return {
      data: json.data,
      total: json.total,
    };
  },

  update: async (resource, params) => {
    const url = `${baseApi}/${resource}/${params.id}`;
    await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    return httpClient(url).then(({ json }) => ({ data: json }));
  },
};

export default resDataProvider;
