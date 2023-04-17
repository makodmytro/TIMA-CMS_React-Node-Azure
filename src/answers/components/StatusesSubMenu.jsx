import React, { useState } from 'react';
import { useTranslate, Button } from 'react-admin';
import { useSelector } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const StatusesSubMenu = ({ record, onStatusChange }) => {
  const translate = useTranslate();

  const statuses = useSelector((state) => state.custom.workflowStatus);

  const [anchorEl, setAnchorEl] = useState(null);

  const options = statuses
    .filter((o) => (record?.possibleNextStatus.length ? (record?.possibleNextStatus || []).includes(o.value) : true))
    .map((o) => ({ id: o.value, name: translate(`resources.users.workflow.status.${o.name}`) }))
    .reverse();
  const matching = statuses.find((s) => s.value === record?.status);

  if (matching && !options.find((o) => o.id === matching.value)) {
    options.unshift({ id: matching.value, name: translate(`resources.users.workflow.status.${matching.name}`) });
  }

  const handleChangeStatusMenuHover = () => {
    setAnchorEl(null);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        id="statuses-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option.id === record?.status}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(option.id);
              setAnchorEl(null);
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>

      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          setAnchorEl(e.currentTarget);
        }}
        onMouseEnter={handleChangeStatusMenuHover}
      >
        <Button
          label={translate('misc.change_status')}
          variant="text"
          color="inherit"
          size="small"
          startIcon={<ChevronLeft size="large" style={{ fontSize: 30, marginLeft: -4, marginRight: -12 }} />}
        />
      </MenuItem>
    </>
  );
};

export default StatusesSubMenu;
