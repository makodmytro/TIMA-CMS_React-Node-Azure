import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslate, TextField } from 'react-admin';
import Box from '@material-ui/core/Box';
import StatusColorCodes from '../../status-color-codes.json';

const StatusField = ({ record }) => {
  const status = useSelector((state) => state.custom.workflowStatus);
  const translate = useTranslate();

  if (!record || !record.status) {
    return '-';
  }

  const match = status.find((s) => s.value === record.status);

  if (!match) {
    return '-';
  }

  return (
    <Box position="relative" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
      <Box
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '20px',
          border: `1px solid ${StatusColorCodes[match.name]}`,
          backgroundColor: `${StatusColorCodes[match.name]}81`,
        }}
      >
        &nbsp;
      </Box>
      <TextField source="name" record={{ name: translate(`resources.users.workflow.status.${match.name}`) }} />
    </Box>
  );
};

export default StatusField;
