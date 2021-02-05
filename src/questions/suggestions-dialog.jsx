import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import CheckIcon from '@material-ui/icons/Check';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';

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

const SuggestionDialog = ({ record, open, onClose }) => {
  const classes = styles();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [suggestions, setSuggestions] = React.useState([]);
  const [associations, setAssociations] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await dataProvider.questionSuggestions(null, {
        id: record.id,
      });

      setSuggestions(data.data);
    } catch (err) {
      notify(`Failed to get suggestions: ${err.message}`, 'error');
    }
    setLoading(false);
  };

  const associate = async (id) => {
    try {
      await dataProvider.createQuestionAssociation(null, {
        id: record.id,
        parentId: id,
      });
      setAssociations(associations.concat([id]));
      notify('The question was associated successfully');
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  React.useEffect(() => {
    if (open) {
      setSuggestions([]);
      setAssociations([]);
      fetch();
    }
  }, [open]);

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth className={classes.root} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">Suggested questions</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          {
            loading && (<>Loading...</>)
          }
          {
            !loading && !suggestions.length && (
              <Alert severity="info" elevation={3}>
                There are no suggestions
              </Alert>
            )
          }
          {
            !loading && !!suggestions.length && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Text</TableCell>
                    <TableCell>Already associated to</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    suggestions.map((suggestion, i) => (
                      <TableRow key={i}>
                        <TableCell>{suggestion.ParentQuestion.text}</TableCell>
                        <TableCell>{suggestion.countSelected} questions</TableCell>
                        <TableCell>
                          {
                            associations.includes(suggestion.ParentQuestion.id) && (
                              <CheckIcon />
                            )
                          }
                          {
                            !associations.includes(suggestion.ParentQuestion.id) && (
                              <Button
                                type="button"
                                onClick={() => associate(suggestion.ParentQuestion.id)}
                                variant="outlined"
                                color="primary"
                                size="small"
                              >
                                Associate
                              </Button>
                            )
                          }
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            )
          }
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            type="button"
            onClick={onClose}
            variant="contained"
            color="secondary"
          >
            Finalize
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SuggestionDialog;
