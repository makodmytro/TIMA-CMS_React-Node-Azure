import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslate, TextField } from 'react-admin';
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
    <div>
      <span
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '20px',
          borderColor: StatusColorCodes[match.name],
          color: StatusColorCodes[match.name],
          opacity: '0.7',
        }}
      >
        &nbsp;
      </span>
      <TextField source="name" record={{ name: translate(`resources.users.workflow.status.${match.name}`) }} />
    </div>
  );
};

export default StatusField;
