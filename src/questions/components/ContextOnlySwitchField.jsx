import React from 'react';
import Switch from '@material-ui/core/Switch';
import {
  useDataProvider,
  useNotify,
  useRefresh,
} from 'react-admin';

const ContextOnlySwitchField = ({ record, disabled, afterEdit }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const update = async (checked) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { contextOnly: checked },
      });

      notify('The question was updated');

      if (afterEdit) {
        afterEdit();
      } else {
        refresh();
      }
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  if (!record) {
    return null;
  }

  return (
    <Switch
      onClick={(e) => {
        e.stopPropagation();
      }}
      onChange={(e) => {
        e.preventDefault();
        e.stopPropagation();

        update(e.target.checked);
      }}
      checked={!!record.contextOnly}
      disabled={disabled === true}
    />
  );
};

export default ContextOnlySwitchField;
