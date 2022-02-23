import React from 'react';
import Switch from '@material-ui/core/Switch';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  usePermissions,
} from 'react-admin';

const ApprovedSwitchField = ({ record, disabled }) => {
  const { permissions } = usePermissions();

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const updateApproved = async (approved) => {
    const data = {
      approved,
      approvedAt: approved ? (new Date()).toISOString() : null,
      approvedBy_editorId: approved ? permissions.userId : null,
    };
    try {
      await dataProvider.update('answers', {
        id: record.id,
        data,
      });

      notify('The answer was updated');
      refresh();
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
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
