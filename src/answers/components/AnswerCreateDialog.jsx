import React from 'react';
import { Form } from 'react-final-form';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  TextInput,
  required,
} from 'react-admin';
import {
  Dialog,
  Button,
  IconButton,
  Typography,
  Box,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

const Filters = ({
  onCreateSubmit,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onCreateSubmit}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex">
              <Box flex={3}>
                <TextInput label="resources.answers.fields.text" source="text" fullWidth autoComplete="no" validate={required()} />
              </Box>
              <Box flex={1} ml={1} pt={2}>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  type="submit"
                  fullWidth
                  disabled={submitting}
                >
                  {translate('resources.answers.create')}
                </Button>
              </Box>
            </Box>
          </form>
        );
      }}
    />
  );
};

const AnswerLinkDialog = ({ record, afterLink }) => {
  const [open, setOpen] = React.useState(false);
  const disabled = record?.allowEdit === false;
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();

  const onSelect = async (fk_answerId) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: {
          fk_answerId,
        },
      });
      notify('The record has been updated');

      if (afterLink) {
        afterLink();
      } else {
        refresh();
      }

      setOpen(false);
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
  };

  const onCreateSubmit = async (values) => {
    try {
      const { data } = await dataProvider.create('answers', {
        data: {
          ...values,
          fk_topicId: record?.fk_topicId,
          fk_languageId: record?.fk_languageId,
          isFollowup: record?.isFollowup,
        },
      });
      onSelect(data.id);
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
  };

  return (
    <>
      {
        open && (
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth disableBackdropClick onClick={(e) => e.stopPropagation()}>
            <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
              <Box flex="2">
                <Typography>{translate('resources.answers.create')}</Typography>
              </Box>
              <Box flex="1" textAlign="right">
                <IconButton onClick={() => setOpen(false)} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box p={2}>
              <Filters onCreateSubmit={onCreateSubmit} />
            </Box>
          </Dialog>
        )
      }

      <Button
        size="small"
        className="error-btn btn-xs"
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          setOpen(true);
        }}
        disabled={disabled}
      >
        <AddIcon />
        &nbsp;{translate('misc.link_answer')}
      </Button>
    </>
  );
};

export default AnswerLinkDialog;
