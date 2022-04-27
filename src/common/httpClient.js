import { fetchUtils, HttpError } from 'react-admin';
import * as Sentry from '@sentry/react';

const httpClient = async (url, options = {}, omitToken = false) => {
  if (!options.headers || !(options.headers instanceof Headers)) {
    // eslint-disable-next-line no-param-reassign
    options.headers = new Headers({ Accept: 'application/json' });
  }

  const token = sessionStorage.getItem('token');
  if (token && !omitToken) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const result = await fetchUtils.fetchJson(url, options);
    return result;
  } catch (err) {
    if (err?.status && err?.body?.message) {
      return Promise.reject(new HttpError(err.body.message, err.status, err.body)); //TODO - use resources err?.body?.code
    }

    if (err?.status && err?.status !== 401) {
      Sentry.captureException(err);
    }

    //otherwise continue as standard error
    throw err;
  }
};

export default httpClient;

export const baseApi = process.env.REACT_APP_BASE_API;
