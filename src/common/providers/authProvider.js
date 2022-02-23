import httpClient, { baseApi } from '../httpClient';

const authProvider = {
  login: ({ username, password }) => {
    const url = `${baseApi}/users/login`;
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
  getPermissions: () => {
    const user = JSON.parse(localStorage.getItem('user'));

    // user.permissions = [{
      // fk_topicId: '882284d1-563d-4b88-9c20-1015b2f10e05',
      // edit: false,
      // delete: true,
    // }];
    // user.isAdmin = false;

    return Promise.resolve({
      ...user,
      topics: user.permissions.reduce((acc, cur) => {
        return {
          ...acc,
          [cur.fk_topicId]: cur,
        };
      }, {}),
    });
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
