import React from 'react';
import debounce from 'lodash/debounce';
import { Form } from 'react-final-form';
import {
  useTranslate,
  TextInput,
  useNotify,
  useDataProvider,
  usePermissions,
} from 'react-admin';
import {
  Box,
  Button,
  Dialog,
  Typography,
  IconButton,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Checkbox,
  CircularProgress,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { PlayableTextField } from '../../common/components/playable-text';
import AnswerField from './AnswerField';
import { useDisabledCreate } from '../../hooks';

const Filters = ({
  onSubmit,
  onCreateSubmit,
  selected,
  onSelectedSubmit,
  selectedButtonText,
}) => {
  const translate = useTranslate();
  const disableCreate = useDisabledCreate();

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, values }) => {
        return (
          <form onSubmit={handleSubmit} autoComplete="off">
            <Box display="flex">
              <Box flex={3}>
                <Typography variant="body2">
                  {translate('misc.search_create_questions')}
                </Typography>
                <TextInput label="resources.questions.fields.text" source="q" fullWidth onChange={() => form.submit()} autoComplete="no" />
              </Box>
              <Box flex={1} px={2} pt={5}>
                {
                  !disableCreate && !selected.length && (
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => onCreateSubmit({ text: values.q })}
                      disabled={Object.keys(values).length === 0}
                      fullWidth
                    >
                      {translate('resources.questions.create')}
                    </Button>
                  )
                }
                {
                  !!selected.length && (
                    <Button
                      type="button"
                      onClick={onSelectedSubmit}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      {translate(selectedButtonText, { val: selected.length })}
                    </Button>
                  )
                }
              </Box>
            </Box>
          </form>
        );
      }}
    />
  );
};

const ResultsList = ({
  record,
  questions,
  selected,
  toggleSelect,
}) => {
  const translate = useTranslate();
  const isSelected = (question) => selected.includes(question.id);
  // const questionsWithoutContextOnly = questions?.filter((question) => !question.isContextOnly);
  if (!questions) {
    return null;
  }

  if (!questions.length) {
    return (
      <Alert severity="info">
        {translate('resources.questions.no_results')}
      </Alert>
    );
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            <TableCell>{translate('resources.questions.fields.text')}</TableCell>
            <TableCell>{translate('resources.questions.fields.fk_answerId')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            questions.map((question, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox
                    checked={isSelected(question)}
                    value={isSelected(question)}
                    onClick={() => toggleSelect(question)}
                    disabled={record?.id === question?.fk_answerId}
                  />
                </TableCell>
                <TableCell>
                  <PlayableTextField source="text" record={{ ...question }} />
                </TableCell>
                <TableCell style={{ width: '50%' }}>
                  {
                    question.fk_answerId && question?.fk_answerId !== record?.id && (
                      <AnswerField record={question} />
                    )
                  }
                  {
                    question?.fk_answerId === record?.id && (
                      <>{translate('misc.already_linked')}</>
                    )
                  }
                  {
                    !question.fk_answerId && ('-')
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </>
  );
};

const SearchCreateDialog = ({
  open,
  onClose,
  record,
  createInitialValues,
  afterCreate,
  selectedButtonText,
  selectedButtonOnClick,
}) => {
  const [selected, setSelected] = React.useState([]);
  const [questions, setQuestions] = React.useState(null);
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const onCreateSubmit = async (values) => {
    try {
      const { data } = await dataProvider.create('questions', {
        data: {
          ...values,
          ...createInitialValues,
        },
      });

      afterCreate(data);
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
  };

  const onFiltersSubmit = debounce(async (values) => {
    setSelected([]);

    if (!values.q) {
      setQuestions(null);

      return;
    }
    try {
      const filter = { ...values };

      if (record && record.fk_topicId) {
        filter.fk_topicId = record.fk_topicId;
      }

      if (record && record.fk_languageId) {
        filter.fk_languageId = record.fk_languageId;
      }

      const { data } = await dataProvider.getList('questions', {
        filter,
        pagination: { perPage: 50, page: 1 },
      });

      setQuestions(data);
    } catch (err) {
      notify(err?.body?.message || 'Unexpected error', 'error');
    }
  }, 500);

  const toggleSelect = (question) => {
    if (selected.includes(question.id)) {
      setSelected(selected.filter((s) => s !== question.id));
    } else {
      setSelected(selected.concat([question.id]));
    }
  };

  const onSelectedSubmit = () => {
    selectedButtonOnClick(selected);
  };

  React.useEffect(() => {
    if (open) {
      setSelected([]);
      setQuestions(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="lg">
      <Box display="flex" p={2}>
        <Box flex={5}>
          <Typography>
            {translate('resources.answers.related_questions')}
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
        <Filters
          onSubmit={onFiltersSubmit}
          onCreateSubmit={onCreateSubmit}
          selected={selected}
          onSelectedSubmit={onSelectedSubmit}
          selectedButtonText={selectedButtonText}
        />
        <hr />
        <ResultsList
          {...{
            questions,
            selected,
            toggleSelect,
            record,
          }}
        />
      </Box>
    </Dialog>
  );
};

export default SearchCreateDialog;
