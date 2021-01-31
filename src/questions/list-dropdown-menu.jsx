import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import { Link } from 'react-router-dom'; // eslint-disable-line
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ViewIcon from '@material-ui/icons/Visibility';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

const DropdownMenu = ({
  record,
  deleteQuestion,
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

  const onDeleteClicked = (e) => {
    e.stopPropagation();

    deleteQuestion(record);
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
          component={Link}
          to={`/questions/${record.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <ListItemIcon><EditIcon /></ListItemIcon>
          Edit question
        </MenuItem>
        {
          !!record.fk_answerId && (
            <MenuItem
              component={Link}
              to={`/answers/${record.fk_answerId}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ListItemIcon><ViewIcon /></ListItemIcon>
              View answer
            </MenuItem>
          )
        }
        {
          !!deleteQuestion && (
            <MenuItem onClick={onDeleteClicked}>
              <ListItemIcon><DeleteIcon /></ListItemIcon>
              Delete question
            </MenuItem>
          )
        }
      </Menu>
    </div>
  );
};

DropdownMenu.defaultProps = {
  deleteQuestion: null,
};

DropdownMenu.propTypes = {
  record: PropTypes.shape({
    fk_answerId: PropTypes.string,
    id: PropTypes.string.isRequired,
    relatedQuestions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  deleteQuestion: PropTypes.func,
};

export default DropdownMenu;
