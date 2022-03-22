import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  DeleteButton,
  EditButton,
  useRefresh,
  ResourceContextProvider,
  useTranslate,
} from 'react-admin';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import IgnoreButton from './ignore-button';
import EditDialog from './EditDialog';
import { useDisabledEdit, useDisabledDelete } from '../../hooks';

const DropdownMenu = ({
  record,
  editInline,
}) => {
  const refresh = useRefresh();
  const translate = useTranslate();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const disableEdit = useDisabledEdit(record?.fk_topicId);
  const disableDelete = useDisabledDelete(record?.fk_topicId);

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
          onClick={handleClose}
        >
          {
            !editInline && (
              <EditButton
                basePath="/questions"
                record={record}
                label={translate('resources.questions.edit')}
                color="secondary"
                fullWidth
                style={{ justifyContent: 'flex-start' }}
                disabled={disableEdit}
              />
            )
          }
          {
            editInline && (
              <>
                <EditDialog record={record} open={open} onClose={() => setOpen(false)} />
                <Button
                  disabled={disableEdit}
                  onClick={() => {
                    setOpen(true);
                  }}
                  size="small"
                  fullWidth
                >
                  <EditIcon style={{ fontSize: '20px' }} /> &nbsp;{translate('resources.questions.edit')}
                </Button>
              </>
            )
          }
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
                label={translate('resources.answers.edit')}
                color="default"
                fullWidth
                style={{ justifyContent: 'flex-start' }}
                disabled={disableEdit}
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
              disabled={disableDelete}
            />
          </ResourceContextProvider>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <IgnoreButton record={record} onClick={handleClose} disabled={disableEdit} />
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
