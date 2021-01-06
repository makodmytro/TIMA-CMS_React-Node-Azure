import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'; // eslint-disable-line
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { PlayableTextField } from '../common/components/playable-text';
import DropdownMenu from './list-dropdown-menu';

const styles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
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

const SuggestionDialog = ({
  record,
  open,
  onClose,
  deleteQuestion,
  removeAnswer,
}) => {
  const classes = styles();

  if (!record || !record.relatedQuestions) {
    return null;
  }

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth="lg" fullWidth className={classes.root} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">Related questions</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Text</TableCell>
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                record.relatedQuestions.map((related, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <PlayableTextField source="text" record={{ ...related, Language: record.Language }} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        record={{ ...related, Language: record.Language }}
                        deleteQuestion={deleteQuestion}
                        removeAnswer={removeAnswer}
                      />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            type="button"
            onClick={onClose}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SuggestionDialog;
