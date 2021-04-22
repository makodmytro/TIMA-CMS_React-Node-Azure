import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  DeleteButton,
  EditButton,
  useRefresh,
  ResourceContextProvider,
  usePermissions,
} from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import IgnoreButton from './ignore-button';

const DropdownMenu = ({
  record,
}) => {
  const { permissions } = usePermissions();
  const refresh = useRefresh();
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
          onClick={handleClose}
        >
          <EditButton
            basePath="/questions"
            record={record}
            label="Edit question"
            color="secondary"
            fullWidth
            style={{ justifyContent: 'flex-start' }}
          />
        </MenuItem>
        {
          !!record.fk_answerId && (
            <MenuItem
              onClick={handleClose}
            >
              <EditButton
                basePath="/answers"
                record={{
                  id: record.fk_answerId,
                }}
                label="Edit answer"
                color="default"
                fullWidth
                style={{ justifyContent: 'flex-start' }}
              />
            </MenuItem>
          )
        }
        <MenuItem onClick={handleClose}>
          <ResourceContextProvider value="questions">
            <DeleteButton
              basePath="/questions"
              record={record}
              undoable={false}
              onClick={handleClose}
              resource="questions"
              onSuccess={() => refresh()}
              fullWidth
              style={{ justifyContent: 'flex-start' }}
              disabled={permissions && !permissions.allowDelete}
            />
          </ResourceContextProvider>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <IgnoreButton record={record} onClick={handleClose} />
        </MenuItem>
      </Menu>
    </div>
  );
};

DropdownMenu.propTypes = {
  record: PropTypes.shape({
    fk_answerId: PropTypes.string,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default DropdownMenu;
