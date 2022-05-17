import React from 'react';
import { useTranslate, useRedirect } from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import QrDialog from './qr-dialog';
import ShowQuestionsButton from './ShowQuestionsButton';
import { useIsAdmin } from '../../hooks';

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
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <ShowQuestionsButton record={record} fullWidth />
        </MenuItem>
        {
          record?.globalTopic && (
            <MenuItem
              onClick={(e) => e.stopPropagation()}
            >
              <QrDialog record={record} fullWidth />
            </MenuItem>
          )
        }
        {
          admin && (
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
          admin && !!onPermissionsClick && (
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
      </Menu>
    </div>
  );
};

export default DropdownMenu;
