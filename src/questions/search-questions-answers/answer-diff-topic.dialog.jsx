import React from 'react';
import { useTranslate } from 'react-admin';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const AnswerDiffTopicDialog = ({ open, onClose, topics, record, selected, onUpdate, onDuplicate }) => {
  const translate = useTranslate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" width="md" fullWidth>
      <DialogTitle>{translate('resources.questions.topic_mismatch')}</DialogTitle>
      <DialogContent>
        <Typography>
          {translate('resources.questions.topic_mismatch_explanation', {
            a: topics[record.fk_topicId].name,
            b: topics[selected.fk_topicId].name,
          })}
        </Typography>
        <Box py={2}>
          <Typography>{translate('misc.choose_one_option')}:</Typography>
          <Typography>{translate('resources.questions.topic_mismatch_option_a', { a: topics[selected.fk_topicId].name })}</Typography>
          <Typography>{translate('resources.questions.topic_mismatch_option_b', { b: topics[record.fk_topicId].name })}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" size="small" type="button" onClick={onUpdate}>
          {translate('resources.questions.update')}
        </Button>
        <Button variant="contained" color="secondary" size="small" type="button" onClick={onDuplicate}>
          {translate('resources.answers.duplicate')}
        </Button>
        <Button variant="outlined" style={{ borderColor: 'red', color: 'red' }} size="small" type="button" onClick={onClose}>
          {translate('misc.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerDiffTopicDialog;
