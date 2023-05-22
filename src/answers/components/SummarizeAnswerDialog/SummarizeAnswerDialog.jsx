import React from 'react';
import { Dialog, IconButton, Typography, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslate } from 'react-admin';

const SummarizeAnswerDialog = ({
  text,
  open,
  onClose,
  onSuccess,
}) => {
  const translate = useTranslate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      disableBackdropClick
      onClick={(e) => e.stopPropagation()}
    >
      <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
        <Box flex="2">
          <Typography>{translate('resources.answers.summarize')}</Typography>
        </Box>
        <Box flex="1" textAlign="right">
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box p={2}>
        <Typography>{ text }</Typography>
      </Box>
      <Box p={2} display="flex">
        <Box flex={1}>
          <Button
            variant="contained"
            color="secondary"
            type="button"
            size="small"
            onClick={() => { onSuccess(); }}
          >
            {translate('misc.accept')}
          </Button>
        </Box>
        <Box flex={1} textAlign="right">
          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{ backgroundColor: '#c3170a' }}
            onClick={onClose}
          >
            {translate('misc.discard')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SummarizeAnswerDialog;
