import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources, useLocale, useSetLocale, useTranslate, useDataProvider } from 'react-admin';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import DefaultIcon from '@material-ui/icons/ViewList';
import HomeIcon from '@material-ui/icons/Home';
import DemoIcon from '@material-ui/icons/AddToQueue';
import BugReport from './BugReport';
import { baseApi } from '../httpClient';
import { useIsAdmin } from '../../hooks';

const HIDE_MENU_ITEMS = process.env.REACT_APP_HIDE_MENU_ITEMS ? process.env.REACT_APP_HIDE_MENU_ITEMS.split(',') : [];
const ADMIN_MENUS = ['users', 'audit'];

const Menu = ({ onMenuClick, logout }) => {
  const [backend, setBackend] = React.useState(null);
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const { isSyncInProgress, nextSyncScheduled } = useSelector((state) => state.custom);
  const resources = useSelector(getResources);
  const translate = useTranslate();
  const dispatch = useDispatch();
  const locale = useLocale();
  const setLocale = useSetLocale();
  const dataProvider = useDataProvider();
  const isAdmin = useIsAdmin();

  const getBackendVersion = async () => {
    const { data } = await dataProvider.backendVersion();

    setBackend(data);
  };

  React.useEffect(() => {
    getBackendVersion();
  }, []);

  const onClick = (resource) => (e) => {
    const filter = {};

    if (resource === 'questions') {
      filter.ignored = false;
      filter.topLevelOnly = '1';
    }

    dispatch({
      type: 'RA/CRUD_CHANGE_LIST_PARAMS',
      payload: {
        filter,
      },
      meta: { resource },
    });

    return onMenuClick(e);
  };

  const onLocaleChange = () => {
    const l = locale === 'en' ? 'de' : 'en';

    setLocale(l);
    localStorage.setItem('tima-locale', l);
  };

  return (
    <>
      <Box py={2}>
        {!HIDE_MENU_ITEMS.includes('dashboard') && (
          <MenuItemLink to="/" primaryText={translate('Dashboard')} leftIcon={<HomeIcon />} onClick={onMenuClick} sidebarIsOpen={open} />
        )}

        {resources
          .filter((r) => {
            return r.name !== 'groups' && !HIDE_MENU_ITEMS.includes(r.name) && (!ADMIN_MENUS.includes(r.name) || isAdmin);
          })
          .map((resource) => (
            <MenuItemLink
              key={resource.name}
              to={`/${resource.name}`}
              primaryText={translate(`resources.${resource.name}.name`, { smart_count: 2 })}
              leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
              onClick={onClick(resource.name)}
              sidebarIsOpen={open}
            />
          ))}
        <MenuItemLink to="/test-ask" primaryText={translate('Test')} leftIcon={<DemoIcon />} onClick={onMenuClick} sidebarIsOpen={open} />
        {isXSmall && logout}
      </Box>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 5,
            left: 5,
            fontSize: 10,
          }}
        >
          {isSyncInProgress && isAdmin && (
            <Box mb={2} textAlign="center">
              <Typography variant="body2" style={{ fontSize: '0.8rem' }} component="span">
                {translate('Topic sync in progress')}
              </Typography>
              &nbsp; <CircularProgress color="primary" size={15} />
            </Box>
          )}
          {!isSyncInProgress && !!nextSyncScheduled && isAdmin && (
            <Box mb={2} textAlign="center">
              <Typography variant="body2" style={{ fontSize: '0.8rem' }} component="span">
                {translate('Topic Sync Scheduled')}: <br />
                {new Date(nextSyncScheduled).toLocaleString(navigator.language, { dateStyle: 'short', timeStyle: 'short' })}
              </Typography>
            </Box>
          )}
          <Box textAlign="center">
            <Typography variant="body2" component="span">
              DE
            </Typography>
            &nbsp;
            <Switch size="small" checked={locale === 'en'} onChange={onLocaleChange} />
            &nbsp;
            <Typography variant="body2" component="span">
              EN
            </Typography>
          </Box>
          <div>
            CMS Build:
            <span style={{ float: 'right' }}>{process.env.REACT_APP_VERSION}</span>
          </div>
          <div>
            Backend Build:
            <span style={{ float: 'right' }}>{backend}</span>
          </div>
          {baseApi}
          <Box mt={2}>
            <BugReport cmsVersion={process.env.REACT_APP_VERSION} backendVersion={backend} />
          </Box>
        </div>
      )}
    </>
  );
};

export default Menu;
