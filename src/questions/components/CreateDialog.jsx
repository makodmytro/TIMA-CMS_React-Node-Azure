import React from 'react';
import {
  useDataProvider,
  useNotify,
  useTranslate,
  required,
  TextInput,
} from 'react-admin';
import { Form } from 'react-final-form';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const CreateDialog = ({
  open,
  onClose,
  onSuccess,
  initialValues,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const translate = useTranslate();

  const onSubmit = async (values) => {
    try {
      const { data } = await dataProvider.create('questions', {
        data: {
          ...values,
        },
      });

      onSuccess(data);
      onClose();
    } catch (e) {
      notify(e?.body?.message || 'Could not create', 'error');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box display="flex" p={2}>
        <Box flex={5}>
          <Typography>
            {translate('misc.create')} {translate('resources.answers.followup_questions')}
          </Typography>
        </Box>
        <Box flex={1} textAlign="right">
          <IconButton
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box p={2}>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            text: '',
            ...initialValues,
          }}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} autoComplete="off">
                <TextInput
                  label="resources.questions.fields.text"
                  source="text"
                  validate={required()}
                  fullWidth
                />
                <Box textAlign="right" py={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
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

export default CreateDialog;
