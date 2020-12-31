import React from 'react';
import {
  TopToolbar,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom'; // eslint-disable-line

const Toolbar = (props) => {
  const history = useHistory();

  return (
    <TopToolbar>
      <Button
        color="secondary"
        size="small"
        onClick={() => history.goBack()}
      >
        <BackIcon />
      </Button>
      &nbsp;
      {props.children}
    </TopToolbar>
  );
};

export default Toolbar;
