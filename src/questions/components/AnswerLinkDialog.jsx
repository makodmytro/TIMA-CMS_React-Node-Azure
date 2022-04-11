import React from 'react';
import debounce from 'lodash/debounce';
import { Form } from 'react-final-form';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  useTranslate,
  TextInput,
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
}) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex">
              <Box flex={3}>
                <Typography variant="body2">
                  {translate('misc.search_answers_link')}
                </Typography>
                <TextInput label="misc.text" source="q" fullWidth onChange={() => form.submit()} autoComplete="no" />
              </Box>
            </Box>
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

const AnswerLinkDialog = ({ record }) => {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [answers, setAnswers] = React.useState(null);
  const disabled = record?.allowEdit === false; // useDisabledEdit(record.fk_topicId);
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
      refresh();
      setOpen(false);
    } catch (e) {
      notify('Unexpected error', 'error');
    }
  };

  const onFiltersSubmit = debounce(async (values) => {
    if (!values.q) {
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
      notify('Unexpected error', 'error');
    }
    setLoading(false);
  }, 500);

  return (
    <>
      {
        open && (
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth disableBackdropClick onClick={(e) => e.stopPropagation()}>
            <Box p={2} display="flex" borderBottom="1px solid #D5D5D5">
              <Box flex="2">
                <Typography>{translate('misc.link_answer')}</Typography>
              </Box>
              <Box flex="1" textAlign="right">
                <IconButton onClick={() => setOpen(false)} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            <Box p={2}>
              <Filters onSubmit={onFiltersSubmit} />
              {
                loading && (
                  <Box textAlign="center" p={2}>
                    <CircularProgress color="primary" />
                  </Box>
                )
              }
              <ResultsList answers={answers} onSelect={onSelect} />
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
