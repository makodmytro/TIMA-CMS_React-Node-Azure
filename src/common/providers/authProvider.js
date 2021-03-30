import httpClient, { baseApi } from '../httpClient';

const authProvider = {
  login: ({ username, password }) => {
    const url = `${baseApi}/editors/login`;
    return httpClient(url, {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
    }).then(({ body }) => {
      const { accessToken, data } = JSON.parse(body);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('user', JSON.stringify(data));
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },
  reset: ({ username }) => {
    const url = `${baseApi}/auth/password/reset`;
    return httpClient(url, {
      method: 'POST',
      body: JSON.stringify({ name: username }),
    }).then(({ body }) => JSON.parse(body));
  },
  checkAuth: () => (localStorage.getItem('token') ? Promise.resolve() : Promise.reject({ message: false })),
  checkError: (error) => {
    const { status } = error;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return Promise.reject({ message: false });
    }
    return Promise.resolve();
  },
  getPermissions: () => Promise.resolve(JSON.parse(localStorage.getItem('user'))),
  password: ({ oldPassword, newPassword }) => {
    const url = `${baseApi}/auth/password`;
    return httpClient(url, {
      method: 'PUT',
      body: JSON.stringify({ newPassword, oldPassword }),
    });
  },
};

export default authProvider;
