import React from 'react';
import { useTranslate } from 'react-admin';
import { Dialog, Box, Typography, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import List from './List';

const DialogList = ({ record, open, onClose }) => {
  const translate = useTranslate();

  if (!open) {
    return null;
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <Box display="flex" p={2}>
          <Box flex={5}>
            <Typography>{translate('resources.answers.related_questions')}</Typography>
          </Box>
          <Box flex={1} textAlign="right">
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <List record={record} />
      </Dialog>
    </>
  );
};

export default DialogList;
