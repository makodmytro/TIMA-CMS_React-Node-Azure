import React from 'react';
import { AppBar, UserMenu, MenuItemLink, usePermissions, useTranslate, Logout } from 'react-admin';
import { useMsal } from '@azure/msal-react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/AssignmentInd';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Logo from '../../assets/TIMA_logo.png';
import AltLogo from '../../assets/QnA Manager Logo Final green.png';
import { baseApi } from '../httpClient';

const USE_AZURE_LOGIN = process.env.REACT_APP_USE_AZURE_LOGIN;
const AZURE_LOGOUT_REDIRECT_URI = process.env.REACT_APP_AZURE_LOGOUT_REDIRECT_URI;
const USE_ALT_THEME = process.env.REACT_APP_USE_ALT_THEME === '1';

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

const MyUserMenu = (props) => {
  const { permissions } = usePermissions();

  return (
    <UserMenu
      {...props}
      icon={
        <>
          <small>{permissions?.userName}</small> &nbsp;
          <AccountCircleIcon />
        </>
      }
    >
      <ProfileMenu />
    </UserMenu>
  );
};

const CustomLogout = () => {
  const { instance, accounts } = useMsal();

  const onClick = () => {
    instance.logoutRedirect({
      account: accounts[0],
      postLogoutRedirectUri: AZURE_LOGOUT_REDIRECT_URI,
    });
    sessionStorage.clear();
  };

  return <Logout onClick={onClick} />;
};

const MyAppBar = (props) => {
  const classes = useStyles();
  const { onLanguageChange, language, ...rest } = props;

  const style = USE_ALT_THEME
    ? {
        backgroundImage: 'radial-gradient(circle at 100% 14em, #3F4349 0%, #246974 100%)',
        color: 'white',
      }
    : { backgroundColor: '#fafafa' };

  const LogoElement = () => {
    if (USE_ALT_THEME) {
      return (
        <div className={classes.logo}>
          <img src={AltLogo} alt="logo" height={45} />
        </div>
      );
    }

    return (
      <>
        <div className={classes.logo}>
          <img src={Logo} alt="logo" />
        </div>
        <div className={classes.logo}>
          <img src={`${baseApi}/resources/logo`} alt="logoBackend" height="70" />
        </div>
      </>
    );
  };

  return (
    <AppBar
      color="transparent"
      {...rest}
      userMenu={<MyUserMenu {...rest} />}
      style={style}
      logout={USE_AZURE_LOGIN === '1' && sessionStorage.getItem('azure-login') === '1' ? <CustomLogout /> : <Logout />}
    >
      <Typography variant="h6" color="inherit" className={classes.title} id="react-admin-title" />
      <LogoElement />
    </AppBar>
  );
};

export default MyAppBar;
