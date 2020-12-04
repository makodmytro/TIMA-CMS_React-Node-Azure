import simpleRestProvider from 'ra-data-simple-rest';
import httpClient, { baseApi } from '../httpClient';

const dataProvider = simpleRestProvider(baseApi, httpClient);

const resDataProvider = {
  ...dataProvider,
  getList: async (resource) => {
    const url = `${baseApi}/${resource}`;

    const { data } = await httpClient(url);

    return {
      data,
      total: data.length,
    };
  },
};

export default resDataProvider;
