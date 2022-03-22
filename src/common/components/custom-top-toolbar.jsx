import React from 'react';
import {
  TopToolbar,
  useTranslate,
} from 'react-admin';
import Button from '@material-ui/core/Button';
import BackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom'; // eslint-disable-line

const Toolbar = ({ children, extra }) => {
  const history = useHistory();
  const translate = useTranslate();

  return (
    <>
      <TopToolbar style={{ justifyContent: 'flex-start' }}>
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          onClick={() => history.goBack()}
        >
          <BackIcon size="small" /> {translate('misc.back')}
        </Button>
        &nbsp;
        {children}
      </TopToolbar>
      {extra}
    </>
  );
};

export default Toolbar;
