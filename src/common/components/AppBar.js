import React from 'react';
import {
  AppBar,
  UserMenu,
  MenuItemLink,
  usePermissions,
  useTranslate,
} from 'react-admin';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/AssignmentInd';
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

const ProfileMenu = React.forwardRef(({ onClick }, ref) => {
  const { permissions } = usePermissions();
  const translate = useTranslate();

  return (
    <MenuItemLink
      ref={ref}
      to={`/users/${permissions?.userId}/edit`}
      primaryText={translate('My profile')}
      leftIcon={<PersonIcon />}
      onClick={onClick} // close the menu on click
    />
  );
});

const MyUserMenu = (props) => (
  <UserMenu {...props}>
    <ProfileMenu />
  </UserMenu>
);

const MyAppBar = (props) => {
  const classes = useStyles();
  const { onLanguageChange, language, ...rest } = props;

  return (
    <AppBar color="transparent" {...rest} userMenu={<MyUserMenu {...rest} />}>
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
        <img src={`${baseApi}/resources/logo`} alt="logoBackend" height="70" />
      </div>
    </AppBar>
  );
};

export default MyAppBar;
