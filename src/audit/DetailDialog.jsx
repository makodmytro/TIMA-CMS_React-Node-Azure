import React from 'react';
import {
  Dialog,
  Box,
  IconButton,
} from '@material-ui/core';
import ReactDiffViewer from 'react-diff-viewer';
import CloseIcon from '@material-ui/icons/Close';

const DetailDialog = ({
  open,
  onClose,
  record,
}) => {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
        <Box flex="2">&nbsp;</Box>
        <Box flex="1" textAlign="right">
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box p={2}>
        <ReactDiffViewer
          oldValue={JSON.stringify(record?.objectBefore, null, 2)}
          newValue={JSON.stringify(record?.objectAfter, null, 2)}
          splitView
          hideLineNumbers
          showDiffOnly={false}
        />
      </Box>
    </Dialog>
  );
};

export default DetailDialog;
