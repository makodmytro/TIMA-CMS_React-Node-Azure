import React from 'react';
import { EditButton, DeleteButton, useTranslate, useDataProvider, useNotify } from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import StatusesSubMenu from './StatusesSubMenu';
import useAnswer from '../useAnswer';

const DropdownMenu = ({ record }) => {
  const translate = useTranslate();
  const disableEdit = record?.allowEdit === false;
  const disableDelete = record?.allowDelete === false;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dataProvider = useDataProvider();

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);

    return false;
  };
  const { refresh } = useAnswer(record?.id);
  const notify = useNotify();

  const handleClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleStatusChange = async (statusId) => {
    try {
      await dataProvider.updateAnswerStatus('answers', {
        id: record?.id,
        status: statusId,
      });

      refresh();
      notify('The record has been updated');
    } catch (err) {
      refresh();
      const msg = err?.body?.code
        ? translate(`resources.users.workflow.errors.${err.body.code}`)
        : err?.body?.message || 'We could not execute the action';
      notify(msg, 'error');
    }

    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="secondary"
        size="small"
        disabled={disableEdit && disableDelete}
      >
        {translate('misc.actions')} <ExpandIcon />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <EditButton basePath="/answers" record={record} fullWidth style={{ justifyContent: 'flex-start' }} disabled={disableEdit} />
        </MenuItem>
        <StatusesSubMenu record={record} onStatusChange={handleStatusChange} />
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <DeleteButton
            basePath="/answers"
            record={record}
            undoable={false}
            fullWidth
            style={{ justifyContent: 'flex-start' }}
            disabled={disableDelete}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
