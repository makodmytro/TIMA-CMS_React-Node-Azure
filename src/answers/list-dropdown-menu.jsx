import React from 'react';
import {
  EditButton,
  DeleteButton,
} from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import BatchApproveButton from './batch-approve-button';

const DropdownMenu = ({
  record,
  basePath,
}) => {
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
        Actions <ExpandIcon />
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
            basePath={basePath}
            record={record}
            fullWidth
            style={{ justifyContent: 'flex-start' }}
          />
        </MenuItem>
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteButton
            basePath={basePath}
            record={record}
            undoable={false}
            fullWidth
            style={{ justifyContent: 'flex-start' }}
          />
        </MenuItem>
        <MenuItem
          onClick={(e) => e.stopPropagation()}
        >
          <BatchApproveButton answerId={record.id} />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DropdownMenu;
