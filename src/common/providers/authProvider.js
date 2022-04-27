import httpClient, { baseApi } from '../httpClient';

const authProvider = {
  exhangeToken: async ({ token }) => {
    const { body } = await httpClient(`${baseApi}/users/exchangeToken`, {
      method: 'POST',
      headers: new Headers({
        'ms-access-token': token,
      }),
    });

    const { accessToken, data } = JSON.parse(body);

    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem('user', JSON.stringify(data));

    return Promise.resolve(true);
  },
  login: ({ username, password }) => {
    const url = `${baseApi}/users/login`;
    return httpClient(url, {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
    }).then(({ body }) => {
      const { accessToken, data } = JSON.parse(body);
      sessionStorage.setItem('token', accessToken);
      sessionStorage.setItem('user', JSON.stringify(data));
    });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return Promise.resolve();
  },
  reset: ({ username }) => {
    const url = `${baseApi}/auth/password/reset`;
    return httpClient(url, {
      method: 'POST',
      body: JSON.stringify({ name: username }),
    }).then(({ body }) => JSON.parse(body));
  },
  checkAuth: () => (sessionStorage.getItem('token') ? Promise.resolve() : Promise.reject({ message: false })),
  checkError: (error) => {
    const { status } = error;
    if (status === 401 || status === 403) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return Promise.reject({ message: false });
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      // user.permissions = [{
      // fk_topicId: '882284d1-563d-4b88-9c20-1015b2f10e05',
      // edit: true,
      // delete: true,
      // }];
      // user.isAdmin = true;

      if (!user) {
        if (window.location.href.includes('/backdoor-login')) {
          return Promise.resolve({});
        }

        return Promise.reject();
      }

      return Promise.resolve({
        ...user,
        topics: (user.permissions || []).reduce((acc, cur) => {
          return {
            ...acc,
            [cur.fk_topicId]: cur,
          };
        }, {}),
      });
    } catch (e) {
      return Promise.reject();
    }
  },
  password: ({ oldPassword, newPassword }) => {
    const url = `${baseApi}/auth/password`;
    return httpClient(url, {
      method: 'PUT',
      body: JSON.stringify({ newPassword, oldPassword }),
    });
  },
};

export default authProvider;
