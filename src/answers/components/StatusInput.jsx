import React from 'react';
import { Form } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import { useDataProvider, useNotify, useTranslate, SelectInput, TextInput } from 'react-admin';
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert } from '@material-ui/lab';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import useAnswer from '../useAnswer';

const StatusCommentDialog = ({ open, onClose, record }) => {
  const dispatch = useDispatch();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const onSubmit = async (values) => {
    try {
      await dataProvider.statusComment('answers', {
        id: record.id,
        data: values,
      });

      const { data } = await dataProvider.answerWorkflow('answers', {
        id: record.id,
      });

      dispatch({
        type: 'CUSTOM_ANSWER_STATUS_HISTORY',
        payload: {
          id: record.id,
          data,
        },
      });

      notify('Comment added successfully');
      onClose();
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <Box p={2}>
        <Typography>{translate('misc.add_comment')}</Typography>
      </Box>
      <Box p={2}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            text: '',
          }}
          enableReinitialize
          validate={(values) => {
            const errors = {};

            if (!values.text) {
              errors.text = translate('Required');
            }

            return errors;
          }}
          render={({ handleSubmit, valid }) => {
            return (
              <form onSubmit={handleSubmit}>
                <TextInput source="text" label="resources.answers.fields.text" multiline fullWidth rows={5} />

                <Box textAlign="right" mt={2}>
                  <Button type="button" onClick={onClose} variant="outlined" color="secondary">
                    {translate('misc.cancel')}
                  </Button>
                  &nbsp;
                  <Button type="submit" variant="contained" color="primary" disabled={!valid}>
                    {translate('misc.save')}
                  </Button>
                </Box>
              </form>
            );
          }}
        />
      </Box>
    </Dialog>
  );
};

const StatusInput = ({ record, disabled, preSubmitFn }) => {
  const [open, setOpen] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { refresh } = useAnswer();
  const translate = useTranslate();
  const statuses = useSelector((state) => state.custom.workflowStatus);
  const disabledContextOnly = record?.isContextOnly;
  const onSubmit = async ({ status }) => {
    try {
      preSubmitFn?.();
      await dataProvider.updateAnswerStatus('answers', {
        id: record?.id,
        status,
      });
      refresh();
      notify('The record has been updated');
    } catch (err) {
      // refresh();
      const msg =
        err?.message ||
        (err?.body?.code
          ? translate(`resources.users.workflow.errors.${err.body.code}`)
          : err?.body?.message || 'We could not execute the action');
      notify(msg, 'error');
    }
  };

  const options = statuses
    .filter((o) => (record?.possibleNextStatus || []).includes(o.value))
    .map((o) => ({ id: o.value, name: translate(`resources.users.workflow.status.${o.name}`) }));
  const matching = statuses.find((s) => s.value === record?.status);

  if (matching && !options.find((o) => o.id === matching.value)) {
    options.push({ id: matching.value, name: translate(`resources.users.workflow.status.${matching.name}`) });
  }

  const disabledCombined = disabled && options && options.length === 0;

  if (!record) {
    return null;
  }

  return (
    <Box flex={1}>
      <StatusCommentDialog open={open} onClose={() => setOpen(false)} record={record} />
      <Box pt={2}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            status: record?.status,
          }}
          enableReinitialize
          render={({ handleSubmit, valid, pristine }) => {
            return (
              <form
                style={{
                  display: `${!record?.FollowupQuestions && 'flex'}`,
                  justifyContent: `${!record?.FollowupQuestions && 'space-between'}`,
                  alignItems: `${!record?.FollowupQuestions && 'center'}`,
                }}
                onSubmit={handleSubmit}
              >
                <Box display="flex">
                  <Box flex={4}>
                    <SelectInput
                      label="resources.answers.fields.status"
                      record={record}
                      source="status"
                      choices={options}
                      disabled={disabledCombined}
                      fullWidth
                    />
                    {disabledCombined && <Typography variant="body2">{translate('misc.can_not_change_status')}</Typography>}
                  </Box>
                  {record?.FollowupQuestions && (
                    <Box flex={1} textAlign="center" mt={2}>
                      <Button
                        type="button"
                        onClick={() => setOpen(true)}
                        variant="contained"
                        color="secondary"
                        disabled={disabledCombined}
                        size="small"
                      >
                        {translate('misc.add_comment')}
                      </Button>
                    </Box>
                  )}
                </Box>
                {record?.FollowupQuestions && record?.FollowupQuestions?.length !== 0 && (
                  <Box mb={3}>
                    <Alert severity="info">{translate('resources.answers.status.followup_status')}</Alert>
                  </Box>
                )}
                <Button
                  style={{ height: '40px', marginBottom: `${!record?.FollowupQuestions && '15px'}` }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={disabledCombined || !valid || pristine}
                >
                  <SaveIcon style={{ fontSize: '18px' }} />
                  &nbsp; {translate('misc.save')}
                </Button>
              </form>
            );
          }}
        />
      </Box>
    </Box>
  );
};

const StatusInputSection = ({ record, disabled, preSubmitFn }) => {
  const translate = useTranslate();

  return (
    <Box width="100%">
      {record?.FollowupQuestions ? (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
            <Typography>{translate('resources.answers.status.status')}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <StatusInput record={record} disabled={disabled} preSubmitFn={preSubmitFn} />
          </AccordionDetails>
        </Accordion>
      ) : (
        <StatusInput record={record} disabled={disabled} preSubmitFn={preSubmitFn} />
      )}
    </Box>
  );
};

export default StatusInputSection;
