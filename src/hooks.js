import React from 'react'; // eslint-disable-line
import {
  usePermissions,
} from 'react-admin';

// function non-hook to use in other places
export const boolDisabledEdit = (permissions, id, fallback = true) => {
  if (permissions?.isAdmin) {
    return false;
  }

  if (!permissions?.topics[id]) {
    return fallback;
  }

  return !permissions?.topics[id].edit;
};

export const useDisabledEdit = (id, fallback = true) => {
  const { permissions } = usePermissions();

  return boolDisabledEdit(permissions, id, fallback);
};

export const useDisabledApprove = (id, fallback = true) => {
  const { permissions } = usePermissions();

  if (permissions?.isAdmin) {
    return false;
  }

  if (!permissions?.topics[id]) {
    return fallback;
  }

  return !permissions?.topics[id].manage;
};

export const useDisabledDelete = (id, fallback = true) => {
  const { permissions } = usePermissions();

  if (permissions?.isAdmin) {
    return false;
  }

  if (!permissions?.topics[id]) {
    return fallback;
  }

  return !permissions?.topics[id].delete;
};

export const useDisabledCreate = () => {
  const { permissions } = usePermissions();

  if (permissions?.isAdmin) {
    return false;
  }

  if (!permissions?.topics) {
    return true;
  }

  const canCreate = Object.keys(permissions?.topics).some((key) => {
    return permissions?.topics[key].edit;
  });

  return !canCreate;
};

export const useIsAdmin = () => {
  const { permissions } = usePermissions();

  return !!permissions?.isAdmin;
};

export const useRecursiveTimeout = (callback, delay) => {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => { // eslint-disable-line
    let id;
    function tick() {
      const ret = savedCallback.current();

      if (ret instanceof Promise) {
        ret.then(() => {
          if (delay !== null) {
            id = setTimeout(tick, delay);
          }
        });
      } else if (delay !== null) {
        id = setTimeout(tick, delay);
      }
    }
    if (delay !== null) {
      id = setTimeout(tick, delay);
      return () => id && clearTimeout(id);
    }
  }, [delay]);
};
