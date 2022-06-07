import React from 'react';
import { Form } from 'react-final-form';
import { useSelector, useDispatch } from 'react-redux';
import {
  useDataProvider,
  useNotify,
  useTranslate,
  SelectInput,
  TextInput,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import SaveIcon from '@material-ui/icons/Save';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
        <Typography>
          {translate('misc.add_comment')}
        </Typography>
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
                <TextInput
                  source="text"
                  label="resources.answers.fields.text"
                  multiline
                  fullWidth
                  rows={5}
                />

                <Box textAlign="right" mt={2}>
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                  >
                    {translate('misc.cancel')}
                  </Button>
                  &nbsp;
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!valid}
                  >
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

const StatusInput = ({ record, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { refresh } = useAnswer();
  const translate = useTranslate();
  const statuses = useSelector((state) => state.custom.workflowStatus);

  const onSubmit = async ({ status }) => {
    try {
      await dataProvider.updateAnswerStatus('answers', {
        id: record?.id,
        status,
      });
      refresh();
      notify('The record has been updated');
    } catch (err) {
      refresh();
      const msg = err?.body?.code ? translate(`resources.users.workflow.errors.${err.body.code}`) : err?.body?.message || 'We could not execute the action';
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
              <form onSubmit={handleSubmit}>
                <Box display="flex">
                  <Box flex={4}>
                    <SelectInput
                      label="resources.answers.fields.status"
                      record={record}
                      source="status"
                      choices={options}
                      disabled={disabled || !options.length}
                      fullWidth
                    />
                    {
                      (disabled || !options.length) && (
                        <Typography variant="body2">
                          {translate('misc.can_not_change_status')}
                        </Typography>
                      )
                    }
                  </Box>
                  <Box flex={1} textAlign="center" mt={2}>
                    <Button type="button" onClick={() => setOpen(true)} variant="contained" color="secondary" disabled={disabled} size="small">
                      {translate('misc.add_comment')}
                    </Button>
                  </Box>
                </Box>

                <Button type="submit" variant="contained" color="primary" disabled={disabled || !valid || pristine}>
                  <SaveIcon style={{ fontSize: '18px' }} />&nbsp; {translate('misc.save')}
                </Button>
              </form>
            );
          }}
        />
      </Box>
    </Box>
  );
};

const StatusInputSection = ({ record, disabled }) => {
  const translate = useTranslate();

  return (
    <Box width="100%">
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>
            {translate('resources.answers.status.status')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StatusInput record={record} disabled={disabled} />
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default StatusInputSection;
