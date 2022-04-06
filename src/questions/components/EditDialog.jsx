import React from 'react';
import { useSelector } from 'react-redux';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  required,
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
import { PlayableTextInput } from '../../common/components/playable-text';
import { useDisabledEdit } from '../../hooks';

const EditDialog = ({ record, open, onClose }) => {
  const languages = useSelector((state) => state.admin.resources?.languages?.data);
  const disableEdit = useDisabledEdit(record?.fk_topicId) || record?.allowEdit === false;
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const translate = useTranslate();

  const onSubmit = async (values) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: {
          ...values,
        },
      });

      notify('The question was updated');
      refresh();
      onClose();
    } catch (e) {
      notify('Could not update');
    }
  };

  const getLang = () => {
    if (!record.fkLanguageId || !languages[record.fkLanguageId]) {
      return null;
    }

    return languages[record.fkLanguageId].code;
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box display="flex" p={2}>
        <Box flex={5}>
          <Typography>
            {translate('resources.questions.edit')}
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
            text: record.text,
          }}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit} autoComplete="off">
                <PlayableTextInput
                  label="resources.questions.fields.text"
                  source="text"
                  validate={required()}
                  lang={getLang}
                  fullWidth
                  disabled={disableEdit}
                />
                <Box textAlign="right" py={2}>
                  <Button
                    variant="contained"
                    type="button"
                    size="small"
                    onClick={() => onClose()}
                  >
                    {translate('misc.cancel')}
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    size="small"
                    disabled={record?.allowEdit === false}
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

export default EditDialog;
