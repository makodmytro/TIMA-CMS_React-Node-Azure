import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const Alert = ({ onClose, open, title, content, confirm }) => {
  return (
    <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
      <Box px={2} py={1} borderBottom="1px solid #E5E5E5">
        <Typography variant="body2">{title}</Typography>
      </Box>
      <Box p={2}>
        <Typography>{content}</Typography>
      </Box>
      <Box p={2} textAlign="right">
        <Button size="small" onClick={onClose} variant="contained" color="secondary">
          {confirm}
        </Button>
      </Box>
    </Dialog>
  );
};

export default Alert;
