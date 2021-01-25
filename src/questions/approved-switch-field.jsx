import React from 'react';
import Switch from '@material-ui/core/Switch';
import {
  useDataProvider,
  useNotify,
  useRefresh,
} from 'react-admin';

const ApprovedSwitchField = ({ record }) => {
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
      notify('Failed to update the question');
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
    />
  );
};

export default ApprovedSwitchField;
