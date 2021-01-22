import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const BooleanField = ({ record, source }) => {
  if (record[source]) {
    return <DoneIcon color="primary" />;
  }

  return <ClearIcon />;
};

export default BooleanField;
