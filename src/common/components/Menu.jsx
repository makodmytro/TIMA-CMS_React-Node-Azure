import * as React from 'react';
import capitalize from 'lodash/capitalize';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import {
  MenuItemLink,
  getResources,
  useLocale,
  useSetLocale,
  useTranslate,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import DefaultIcon from '@material-ui/icons/ViewList';
import HomeIcon from '@material-ui/icons/Home';
import DemoIcon from '@material-ui/icons/AddToQueue';
import { baseApi } from '../httpClient';

const Menu = ({ onMenuClick, logout }) => {
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const syncStatus = useSelector((state) => state.custom.syncStatus);
  const resources = useSelector(getResources);
  const translate = useTranslate();
  const dispatch = useDispatch();
  const locale = useLocale();
  const setLocale = useSetLocale();

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
        <MenuItemLink
          to="/"
          primaryText="Dashboard"
          leftIcon={<HomeIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
        {
          resources
            .filter((r) => r.name !== 'groups')
            .map((resource) => (
              <MenuItemLink
                key={resource.name}
                to={`/${resource.name}`}
                primaryText={
                  (resource.options && resource.options.label)
                  || capitalize(resource.name)
                }
                leftIcon={
                  resource.icon ? <resource.icon /> : <DefaultIcon />
                }
                onClick={onClick(resource.name)}
                sidebarIsOpen={open}
              />
            ))
        }
        <MenuItemLink
          to="/test-ask"
          primaryText="Test"
          leftIcon={<DemoIcon />}
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />

        {isXSmall && logout}
      </Box>
      <div
        style={{
          position: 'fixed', bottom: 5, left: 5, fontSize: 10,
        }}
      >
        {
          !!syncStatus && syncStatus > 0 && (
            <Box mb={2} textAlign="center">
              <Typography variant="body2" style={{ fontSize: '0.8rem' }} component="span">
                {translate('Topic Sync Scheduled')}
              </Typography>
              &nbsp; <CircularProgress color="primary" size={15} />
            </Box>
          )
        }
        <Box textAlign="center">
          <Typography variant="body2" component="span">DE</Typography>
          &nbsp;
          <Switch size="small" checked={locale === 'en'} onChange={onLocaleChange} />
          &nbsp;
          <Typography variant="body2" component="span">EN</Typography>
        </Box>
        {baseApi}
      </div>
    </>

  );
};

export default Menu;
