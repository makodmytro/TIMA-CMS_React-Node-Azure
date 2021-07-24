import React from 'react';
import { AppBar } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../../assets/TIMA_logo.png';
import { baseApi } from '../httpClient';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',

    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    flex: 1,
  },
  spacer: {
    flex: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    color: 'white',
  },
}));

const MyAppBar = (props) => {
  const classes = useStyles();
  const { onLanguageChange, language, ...rest } = props;

  return (
    <AppBar color="transparent" {...rest}>
      <Typography
        variant="h6"
        color="inherit"
        className={classes.title}
        id="react-admin-title"
      />
      <div className={classes.logo}>
        <img src={Logo} alt="logo" />
      </div>
      <div className={classes.logo}>
        <img src={`${baseApi}/resources/logo`} alt="logoBackend" width="98" />
      </div>
    </AppBar>
  );
};

export default MyAppBar;
