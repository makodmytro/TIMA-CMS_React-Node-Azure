import React from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  SelectInput,
  TextInput,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import PencilIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

const StatusCommentDialog = ({ open, onClose, record }) => {
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider();

  const onSubmit = async (values) => {
    try {
      await dataProvider.statusComment('answers', {
        id: record.id,
        data: values,
      });
      notify('Comment added successfully');
      onClose();
      refresh();
    } catch (err) {} // eslint-disable-line
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
  const [editting, setEditting] = React.useState(false);
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();
  const status = useSelector((state) => state.custom.workflowStatus);

  const _onChange = async (e) => {
    try {
      await dataProvider.updateAnswerStatus('answers', {
        id: record?.id,
        status: e.target.value,
      });
      refresh();
    } catch (err) {
      notify('Failed to change the status', 'error');
    }
  };

  const options = status
    .filter((o) => record?.possibleNextStatus.includes(o.value))
    .map((o) => ({ id: o.value, name: translate(`resources.users.workflow.status.${o.name}`) }));

  if (record.status && !editting) {
    const matching = status.find((s) => s.value === record.status);

    if (matching) {
      return (
        <Box mt={2}>
          <Typography variant="body2">
            {translate('resources.answers.fields.status')}
          </Typography>
          <Button color="secondary" onClick={() => setEditting(true)} size="small">
            {translate(`resources.users.workflow.status.${matching.name}`)} &nbsp;&nbsp;<PencilIcon fontSize="small" />
          </Button>
        </Box>
      );
    }
  }

  return (
    <Box display="flex" mt={2}>
      <StatusCommentDialog open={open} onClose={() => setOpen(false)} record={record} />
      <Box flex={3}>
        <SelectInput
          label="resources.answers.fields.status"
          record={record}
          source="status"
          choices={options}
          disabled={disabled || !options.length}
          onChange={_onChange}
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
        <Button type="button" onClick={() => setOpen(true)} variant="contained" color="secondary">
          {translate('misc.add_comment')}
        </Button>
      </Box>
    </Box>
  );
};

export default StatusInput;
