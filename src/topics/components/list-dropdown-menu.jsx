import React from 'react';
import { useTranslate, useRedirect } from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import QrDialog from './qr-dialog';
import ShowAnswersButton from './ShowAnswersButton';
import DeleteDialog from './DeleteDialog';
import { useIsAdmin } from '../../hooks';

const HIDE_SHOW_QR = process.env.REACT_APP_HIDE_TOPICS_SHOW_QR === '1';

const DropdownMenu = ({
  record,
  onSync,
  onPermissionsClick,
  showCreateChild,
}) => {
  const admin = useIsAdmin();
  const redirect = useRedirect();
  const translate = useTranslate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const disableDelete = record?.allowDelete !== true && !admin;

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);

    return false;
  };

  const handleClose = (e) => {
    e.stopPropagation();
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
        { (admin || record?.allowManage) && (
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outlined"
            onClick={(e) => {
              redirect(`/topics/${record?.id}/edit`);
            }}
            fullWidth
          >
            {translate('misc.edit_topic')}
          </Button>
        </MenuItem>
        )}
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <ShowAnswersButton record={record} fullWidth />
        </MenuItem>
        {
          record?.globalTopic && !HIDE_SHOW_QR && (
            <MenuItem
              onClick={(e) => e.stopPropagation()}
            >
              <QrDialog record={record} fullWidth />
            </MenuItem>
          )
        }
        {
          admin && !record?.fk_parentTopicId && (
            <MenuItem
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outlined"
                onClick={(e) => {
                  handleClose(e);
                  return onSync(record?.id);
                }}
                fullWidth
              >
                {translate('misc.schedule_sync')}
              </Button>
            </MenuItem>
          )
        }
        {
          (admin || record?.allowManage) && !!onPermissionsClick && (
            <MenuItem
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outlined"
                onClick={(e) => {
                  handleClose(e);
                  return onPermissionsClick(record?.id);
                }}
                fullWidth
              >
                {translate('misc.manage_permissions')}
              </Button>
            </MenuItem>
          )
        }
        {
          showCreateChild && (
            <MenuItem
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outlined"
                onClick={(e) => {
                  redirect(`/topics/create?fk_parentTopicId=${record?.id}`);
                }}
                fullWidth
              >
                {translate('resources.topics.create_child')}
              </Button>
            </MenuItem>
          )
        }
        {
          !disableDelete && (
            <MenuItem
              onClick={(e) => {
                handleClose(e);
              }}
            >
              <DeleteDialog record={record} button={{ fullWidth: true }} afterDelete="refresh" />
            </MenuItem>
          )
        }
      </Menu>
    </div>
  );
};

export default DropdownMenu;
