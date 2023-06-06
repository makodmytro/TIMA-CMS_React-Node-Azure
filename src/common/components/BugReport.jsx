import React from 'react';
import { Button, Dialog, Box, Typography, TextField, IconButton } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useDataProvider, useNotify, useTranslate, usePermissions } from 'react-admin';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import RequestTrack from '../../request-track';

const BUG_REPORT_BUTTON_COLOR = '#c3170a';

const BugReport = ({ cmsVersion, backendVersion }) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const { permissions } = usePermissions();
  const notify = useNotify();
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [ticketId, setTicketId] = React.useState(null);
  const history = useSelector((s) => s.custom.navigatedRoutes);

  React.useEffect(() => {
    if (open) {
      setText('');
    }
  }, [open]);

  const onSubmit = async () => {
    try {
      const { data } = await dataProvider.bugReport(null, {
        data: {
          text,
          userId: permissions.userId,
          cmsVersion,
          backendVersion,
          url: window.location.href,
          history,
          endpoints: RequestTrack.get(),
        },
      });

      setTicketId(data.ticketId);
    } catch (err) {
      notify('Unexpected error', 'error');
    }
  };

  return (
    <Box textAlign="center">
      <Button variant="contained" color="secondary" onClick={() => setOpen(true)} style={{ backgroundColor: BUG_REPORT_BUTTON_COLOR }}>
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
          {!ticketId && (
            <>
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
            </>
          )}
          {!!ticketId && (
            <Alert severity="success" elevation={3}>
              {translate('misc.bug_report_success')} #{ticketId}
            </Alert>
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default BugReport;
