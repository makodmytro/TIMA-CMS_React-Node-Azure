import React from 'react';
import { BooleanInput, usePermissions } from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line

const ApprovedInput = (props) => {
  const { permissions } = usePermissions();

  const {
    input: { onChange: changeApprovedAt },
  } = useField('approvedAt');
  const {
    input: { onChange: changeApprovedBy },
  } = useField('approvedBy_editorId');

  const afterChange = (checked) => {
    if (checked) {
      changeApprovedAt(new Date().toISOString());
      changeApprovedBy(permissions?.editorId);
    } else {
      changeApprovedAt(null);
      changeApprovedBy(null);
    }
  };

  return <BooleanInput source={props.source} label={props.label} onChange={afterChange} disabled={props.disabled === true} />;
};

export default ApprovedInput;
