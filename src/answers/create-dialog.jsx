import React from 'react';
import PropTypes from 'prop-types'; // eslint-disable-line
import {
  SimpleForm,
  useDataProvider,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Form from './form';

const styles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const CreateDialog = (props) => {
  const classes = styles();
  const dataProvider = useDataProvider();
  const { open, onClose, onSuccess } = props;

  const onSubmit = async (values) => {
    const { data } = await dataProvider.create('answers', { data: values });

    onSuccess(data);
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="sm" fullWidth>
      <DialogTitle disableTypography className={classes.root}>
        <Typography variant="h6">Create and insert answer</Typography>
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <SimpleForm save={onSubmit}>
          <Form />
        </SimpleForm>
      </DialogContent>
    </Dialog>
  );
};

CreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CreateDialog;
