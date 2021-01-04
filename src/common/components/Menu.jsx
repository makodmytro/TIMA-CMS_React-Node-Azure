import * as React from 'react';
import capitalize from 'lodash/capitalize';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@material-ui/core';
import { MenuItemLink, getResources } from 'react-admin';
import Box from '@material-ui/core/Box';
import DefaultIcon from '@material-ui/icons/ViewList';
import LabelIcon from '@material-ui/icons/Label';
import HomeIcon from '@material-ui/icons/Home';

const Menu = ({ onMenuClick, logout }) => {
  const isXSmall = useMediaQuery((theme) => theme.breakpoints.down('xs'));
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);
  return (
    <Box py={2}>
      <MenuItemLink
        to="/"
        primaryText="Dashboard"
        leftIcon={<HomeIcon />}
        onClick={onMenuClick}
        sidebarIsOpen={open}
      />
      {resources.map((resource) => (
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
          onClick={onMenuClick}
          sidebarIsOpen={open}
        />
      ))}
      {isXSmall && logout}
    </Box>
  );
};

export default Menu;
