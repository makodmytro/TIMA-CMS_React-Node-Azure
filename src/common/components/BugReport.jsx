import React from 'react';
import {
  Button,
  Dialog,
  Box,
  Typography,
  TextField,
  IconButton,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import {
  useDataProvider,
  useNotify,
  useTranslate,
  usePermissions,
} from 'react-admin';
import CloseIcon from '@material-ui/icons/Close';

const BugReport = ({ cmsVersion, backendVersion }) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { permissions } = usePermissions();
  const notify = useNotify();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const history = useSelector((s) => s.custom.navigatedRoutes);

  React.useEffect(() => {
    if (open) {
      setText('');
    }
  }, [open]);

  const onSubmit = async () => {
    try {
      await dataProvider.bugReport(null, {
        data: {
          text,
          userId: permissions.userId,
          cmsVersion,
          backendVersion,
          url: window.location.href,
          history,
        },
      });
      notify('The error was reported successfully');
      setOpen(false);
    } catch (err) {
      notify('Unexpected error', 'error');
    }
  };

  return (
    <Box textAlign="center">
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
        {translate('misc.bug_report')}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} size="md" fullWidth>
        <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
          <Box flex="2">
            <Typography>{translate('misc.bug_report')}</Typography>
          </Box>
          <Box flex="1" textAlign="right">
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Box p={2}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            label={translate('misc.bug_report_text')}
          />
          <Box mt={2} textAlign="right">
            <Button onClick={onSubmit} disabled={!text} variant="contained" color="primary">
              {translate('misc.submit')}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BugReport;
