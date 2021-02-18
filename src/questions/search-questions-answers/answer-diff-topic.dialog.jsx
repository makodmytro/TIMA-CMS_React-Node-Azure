import React from 'react';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const AnswerDiffTopicDialog = ({
  open,
  onClose,
  topics,
  record,
  selected,
  onUpdate,
  onDuplicate,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" width="md" fullWidth>
      <DialogTitle>Topics mismatch</DialogTitle>
      <DialogContent>
        <Typography>
          The question is related to topic <b>"{topics[record.fk_topicId].name}"</b> but the
          answer's topic is <b>"{topics[selected.fk_topicId].name}"</b>.
        </Typography>
        <Box py={2}>
          <Typography>
            Please choose one of the options:
          </Typography>
          <Typography>
            1. Update the question and move it to the same topic as
            the answer (both "{topics[selected.fk_topicId].name}")
          </Typography>
          <Typography>
            2. Duplicate the answer with topic "{topics[record.fk_topicId].name}"
            and link it with the question
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="small"
          type="button"
          onClick={onUpdate}
        >
          Update the question
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          type="button"
          onClick={onDuplicate}
        >
          Duplicate the answer
        </Button>
        <Button
          variant="outlined"
          style={{ borderColor: 'red', color: 'red' }}
          size="small"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerDiffTopicDialog;
