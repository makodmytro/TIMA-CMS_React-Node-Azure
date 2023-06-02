import React from 'react';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux';
import { useTranslate } from 'react-admin';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const StatusWarning = ({ record }) => {
  const translate = useTranslate();
  const status = useSelector((state) => state.custom.workflowStatus);

  if (!record || !USE_WORKFLOW || record?.allowEdit) {
    return null;
  }

  const match = status.find((s) => s.value === record.status);

  if (!record?.possibleNextStatus || record?.possibleNextStatus.length === 0) {
    return (
      <Box my={2}>
        <Alert severity="info" elevation={3}>
          {translate('resources.answers.no_possible_status', {
            status: match ? translate(`resources.users.workflow.status.${match.name}`) : 'N/A',
          })}
        </Alert>
      </Box>
    );
  }

  return (
    <Box my={2}>
      <Alert severity="info" elevation={3}>
        {translate('resources.answers.allow_edit_false', { status: match ? translate(`resources.users.workflow.status.${match.name}`) : 'N/A' })}
      </Alert>
    </Box>
  );
};

export default StatusWarning;
