import * as React from 'react';
import capitalize from 'lodash/capitalize';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import Box from '@material-ui/core/Box';
import DefaultIcon from '@material-ui/icons/ViewList';
import HomeIcon from '@material-ui/icons/Home';
import DemoIcon from '@material-ui/icons/AddToQueue';
import { baseApi } from '../httpClient';

const Menu = ({ onMenuClick, logout }) => {
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);
  const dispatch = useDispatch();

  const onClick = (resource) => (e) => {
    const filter = {};

    if (resource === 'questions') {
      filter.ignored = false;
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
        {baseApi}
      </div>
    </>

  );
};

export default Menu;
