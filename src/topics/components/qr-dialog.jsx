import React from 'react';
import { useTranslate } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const styles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),

    '@media print': {
      width: '100%',
      position: 'absolute',
      top: 0,
      zIndex: 1000,
      backgroundColor: 'white',
    },
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),

    '@media print': {
      display: 'none',
    },
  },
  content: {
    '@media print': {
      height: 'auto',
      overflowY: 'visible',
      boxShadow: 'none',
    },
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],

    '@media print': {
      display: 'none',
    },
  },
  actions: {
    '@media print': {
      display: 'none',
    },
  },
}));

const QrDialog = ({ record, fullWidth, ml }) => {
  const classes = styles();
  const translate = useTranslate();
  const [open, setOpen] = React.useState(false);

  const onClose = (e) => {
    e.stopPropagation();

    setOpen(false);
  };

  if (!record) {
    return null;
  }

  return (
    <>
      <Box ml={ml}>
        <Button
          onClick={(e) => {
            e.stopPropagation();

            setOpen(!open);
          }}
          color="secondary"
          variant="contained"
          type="button"
          size="small"
          fullWidth={!!fullWidth}
        >
          {translate('misc.show_qr_code')}
        </Button>
      </Box>
      <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth className={classes.root} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">{translate('misc.qr_code')}</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          <Box textAlign="center">
            <img src={record.topicQRCode} alt="qr" />
          </Box>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button type="button" onClick={() => window.print()} variant="contained" color="secondary">
            {translate('misc.print')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QrDialog;
