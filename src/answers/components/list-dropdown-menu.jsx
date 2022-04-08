import React from 'react';
import {
  EditButton,
  DeleteButton,
  useTranslate,
} from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import BatchApproveButton from './batch-approve-button';
import { useDisabledDelete, useDisabledEdit } from '../../hooks';

const DropdownMenu = ({
  record,
}) => {
  const translate = useTranslate();
  const disableEdit = useDisabledEdit(record?.fk_topicId);
  const disableDelete = useDisabledDelete(record?.fk_topicId);
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
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <EditButton
            basePath="/answers"
            record={record}
            fullWidth
            style={{ justifyContent: 'flex-start' }}
            disabled={disableEdit}
          />
        </MenuItem>
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <BatchApproveButton answerId={record.id} disabled={disableEdit} />
        </MenuItem>
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
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
