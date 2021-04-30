import { fetchUtils } from 'react-admin';

const httpClient = (url, options = {}, omitToken = false) => {
  if (!options.headers || !(options.headers instanceof Headers)) {
    // eslint-disable-next-line no-param-reassign
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = localStorage.getItem('token');
  if (token && !omitToken) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  return fetchUtils.fetchJson(url, options);
};

export default httpClient;

export const baseApi = process.env.REACT_APP_BASE_API;
