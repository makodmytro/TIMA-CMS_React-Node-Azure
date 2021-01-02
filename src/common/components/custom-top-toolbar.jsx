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
    <TopToolbar style={{ justifyContent: 'flex-start' }}>
      <Button
        color="secondary"
        size="small"
        variant="outlined"
        onClick={() => history.goBack()}
      >
        <BackIcon size="small" /> BACK
      </Button>
      &nbsp;
      {props.children}
    </TopToolbar>
  );
};

export default Toolbar;
