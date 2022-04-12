import React from 'react';
import Switch from '@material-ui/core/Switch';
import {
  useDataProvider,
  useNotify,
  useRefresh,
} from 'react-admin';

const ApprovedSwitchField = ({ record, disabled }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const updateApproved = async (approved) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { approved },
      });

      notify('The question was updated');
      refresh();
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

        updateApproved(e.target.checked);
      }}
      checked={!!record.approved}
      disabled={disabled === true}
    />
  );
};

export default ApprovedSwitchField;
