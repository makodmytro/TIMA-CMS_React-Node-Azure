import React from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import {
  useTranslate,
} from 'react-admin';

const styles = makeStyles((theme) => ({
  redBg: {
    backgroundColor: '#f53649',
    color: 'white',
  },
  paper: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  boxShadow: {
    boxShadow: '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
    backgroundColor: 'white',
    border: '1px solid #9b9b9b',
    borderTop: 'none',
  },
  uppercase: {
    textTransform: 'uppercase',
  }
}));

const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmationText,
}) => {
  const translate = useTranslate();
  const classes = styles();
  const [confirmation, setConfirmation] = React.useState('');
  const [kb, setKb] = React.useState(false);

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableBackdropClick classes={{ paper: classes.paper }}>
      <Box height="2.5vw" boxShadow="none">
        &nbsp;
      </Box>
      <Box className={classes.boxShadow}>
        <Box borderTop="4px solid #f53649">
          <Box
            width="5vw"
            height="5vw"
            borderRadius="50%"
            margin="0 auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={classes.redBg}
            style={{ marginTop: '-2.5vw' }}
          >
            <DeleteIcon fontSize="large" />
          </Box>
        </Box>
        <Box p={2}>
          <Typography align="center" variant="h6" className={classes.uppercase}>{title}</Typography>
          {content}
          <Box mt={4} mb={1}>
            <Typography align="center">
              {translate('misc.type')} "{confirmationText}" {translate('misc.to_confirm')}
            </Typography>
            <Box>
              <TextField
                fullWidth
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                variant="outlined"
                size="small"
                color="secondary"
                error={!!confirmation.length && confirmation.toLowerCase() !== confirmationText?.toLowerCase()}
              />
            </Box>
          </Box>
          <Box textAlign="center">
            <FormControlLabel
              control={(
                <Checkbox
                  checked={kb}
                  onChange={(e) => setKb(e.target.checked)}
                  name="kb"
                />
              )}
              label={translate('misc.delete_kb')}
            />
          </Box>
        </Box>
        <Box p={2} bgcolor="#ececec">
          <Box display="flex">
            <Box flex={1} pr={1}>
              <Button
                onClick={onClose}
                type="button"
                variant="contained"
                fullWidth
              >
                {translate('misc.cancel')}
              </Button>
            </Box>
            <Box flex={1} pl={1}>
              <Button
                onClick={() => onConfirm({ removeKB: kb })}
                type="button"
                variant="contained"
                fullWidth
                className={classes.redBg}
                disabled={confirmation.toLowerCase() !== confirmationText?.toLowerCase()}
              >
                {translate('misc.confirm')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;
