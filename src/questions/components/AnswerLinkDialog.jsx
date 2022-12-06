import React from 'react';
import debounce from 'lodash/debounce';
import { Form } from 'react-final-form';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  TextInput,
  BooleanInput,
} from 'react-admin';
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Dialog,
  Button,
  IconButton,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import AnswerTextField from '../../answers/components/TextField';

const Filters = ({
  onSubmit,
  onCreateSubmit, contextOnlySlider,
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, values }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex">
              <Box flex={3}>
                <Typography variant="body2">
                  {translate('misc.search_answers_link')}
                </Typography>
                <TextInput label="resources.answers.fields.text" source="q" fullWidth onChange={() => form.submit()} autoComplete="no" />
              </Box>
              <Box flex={1} ml={1} pt={5}>
                {
                  !!values?.q?.length && (
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => onCreateSubmit({ text: values.q, isContextOnly: contextOnlySlider || values.isContextOnly })}
                      fullWidth
                    >
                      {translate('resources.answers.create')}
                    </Button>
                  )
                }
              </Box>
            </Box>
            <BooleanInput
              source="isContextOnly"
              label="resources.answers.fields.isContextOnly"
              defaultValue={contextOnlySlider || values.isContextOnly}
            />
            {contextOnlySlider
              && (
                <Alert severity="info">
                  {translate('resources.questions.duplicate_context_only_followups')}
                </Alert>
              )}
          </form>
        );
      }}
    />
  );
};

const ResultsList = ({
  answers,
  onSelect,
}) => {
  const translate = useTranslate();

  if (!answers) {
    return null;
  }

  if (!answers.length) {
    return (
      <Box p={2}>
        <Alert severity="info">
          {translate('misc.no_records')}
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{translate('resources.answers.fields.text')}</TableCell>
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            answers.map((answer, i) => (
              <TableRow key={i}>
                <TableCell>
                  <AnswerTextField record={answer} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    size="small"
                    onClick={() => onSelect(answer.id)}
                  >
                    {translate('misc.link')}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </>
  );
};

const AnswerLinkDialog = ({ record, afterLink, isOpen = false, onClose = false, contextOnlySlider = false, createFinish = () => { }, afterCreate = async () => { } }) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(isOpen);
  const [answers, setAnswers] = React.useState(null);
  const disabled = record?.allowEdit === false;
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();
  const translate = useTranslate();
  const answersWithoutContextOnly = answers?.filter((ans) => !ans.isContextOnly);

  const onSelectLink = async (fk_answerId) => {
    const questionRecord = await afterCreate?.();

    try {
      await dataProvider.update('questions', {
        id: questionRecord?.id ?? record?.id,
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
  const onSelect = async (fk_answerId, recordId = record?.id) => {
    try {
      await dataProvider.update('questions', {
        id: recordId,
        data: {
          fk_answerId,
        },
      });
      refresh();

      notify('The record has been updated');
      setOpen(false);
      if (afterLink) {
        afterLink();
      } else {
        refresh();
      }
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
  };

  const onCreateSubmit = async (values) => {
    try {
      const questionRecord = await afterCreate?.();
      const { data } = await dataProvider.create('answers', {
        data: {
          ...values,
          fk_topicId: questionRecord?.fk_topicId ?? record?.fk_topicId,
          fk_languageId: questionRecord?.fk_languageId ?? record?.fk_languageId,
          isFollowup: questionRecord?.isFollowup ?? record?.isFollowup,
        },
      });
      await onSelect(data.id, questionRecord.id);
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
    setOpen(false);
    createFinish?.();
  };

  const onFiltersSubmit = debounce(async (values) => {
    if (!values?.q) {
      setAnswers(null);

      return;
    }

    setLoading(true);

    try {
      const filter = { ...values };

      const { data } = await dataProvider.getList('answers', {
        filter,
        pagination: { perPage: 50, page: 1 },
      });

      setAnswers(data);
    } catch (err) {
      notify(err?.body?.message || 'Unexpected error', 'error');
    }
    setLoading(false);
  }, 500);
  return (
    <>
      {
        open && (
          <>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth disableBackdropClick onClick={(e) => e.stopPropagation()}>
              <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
                <Box flex="2">
                  <Typography>{translate('misc.link_answer')}</Typography>
                </Box>
                <Box flex="1" textAlign="right">
                  <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box p={2}>
                <Filters onSubmit={onFiltersSubmit} contextOnlySlider={contextOnlySlider} onCreateSubmit={onCreateSubmit} />
                {
                  loading && (
                    <Box textAlign="center" p={2}>
                      <CircularProgress color="primary" />
                    </Box>
                  )
                }
                <ResultsList answers={answersWithoutContextOnly} onSelect={onSelectLink} />
              </Box>
            </Dialog>
          </>
        )
      }
      {/* <Button
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
        {translate('misc.link_answer')}
      </Button> */}
    </>
  );
};

export default AnswerLinkDialog;
