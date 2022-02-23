import React from 'react'; // eslint-disable-line
import {
  usePermissions,
} from 'react-admin';

// function non-hook to use in other places
export const boolDisabledEdit = (permissions, id, fallback = true) => {
  if (!permissions?.topics[id]) {
    return fallback;
  }

  return !permissions?.topics[id].edit;
};

export const useDisabledEdit = (id, fallback = true) => {
  const { permissions } = usePermissions();

  return boolDisabledEdit(permissions, id, fallback);
};

export const useDisabledDelete = (id, fallback = true) => {
  const { permissions } = usePermissions();

  if (!permissions?.topics[id]) {
    return fallback;
  }

  return !permissions?.topics[id].delete;
};

export const useDisabledCreate = () => {
  const { permissions } = usePermissions();

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
