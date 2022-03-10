import React from 'react';
import {
  useDataProvider,
  useNotify,
  useRefresh,
  SelectInput,
  TextInput,
  BooleanInput,
  required,
  usePermissions,
  useTranslate,
} from 'react-admin';
import { Form } from 'react-final-form'; // eslint-disable-line
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Alert from '@material-ui/lab/Alert';
import { PlayableTextField } from '../../common/components/playable-text';
import { Text } from '../AnswerList';
import { useDisabledCreate, boolDisabledEdit } from '../../hooks';

const Filters = ({ onSubmit, initialValues }) => {
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <TextInput label="misc.text" source="q" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <SelectInput
                  label="resources.questions.fields.approved"
                  source="approved"
                  choices={[
                    { id: '__none__', name: translate('misc.both') },
                    { id: true, name: translate('misc.only_approved_questions') },
                    { id: false, name: translate('misc.only_not_approved_questions') },
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <BooleanInput
                  label="resources.questions.fields.ignored"
                  source="ignored"
                  alwaysOn
                  onChange={() => handleSubmit()}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <BooleanInput
                  label="resources.questions.fields.all_topics"
                  source="all_topics"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Box pt={2}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    {translate('misc.search')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

const CreateForm = ({ onSubmit }) => {
  const disabled = useDisabledCreate();
  const translate = useTranslate();

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        text: '',
      }}
      render={({ handleSubmit, form }) => (
        <form onSubmit={(e) => handleSubmit(e)?.then(form.restart)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
              <TextInput label="resources.questions.fields.text" source="text" fullWidth validate={required()} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box pt={2}>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  fullWidth
                  disabled={disabled}
                >
                  {translate('resources.questions.create')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};

const LinksDialog = ({
  record,
}) => {
  const translate = useTranslate();
  const { permissions } = usePermissions();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [selected, setSelected] = React.useState([]);
  const [results, setResults] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    perPage: 5,
    page: 1,
  });
  const [form, setForm] = React.useState({
    q: '',
    all_topics: false,
    ignored: false,
    approved: '__none__',
  });
  const [count, setCount] = React.useState(0);

  const start = () => {
    setResults(null);
    setSelected([]);
    setPagination({
      perPage: 5,
      page: 1,
    });
    setForm({
      q: '',
      all_topics: false,
      ignored: false,
      approved: '__none__',
    });
  };

  React.useEffect(() => {
    start();
  }, []);

  if (!record) {
    return null;
  }

  const isSelected = (result) => selected.includes(result.id);
  const selectResult = (result) => {
    if (isSelected(result)) {
      setSelected(selected.filter((s) => s !== result.id));
    } else {
      setSelected(selected.concat([result.id]));
    }
  };

  const onSubmit = async (values, paging = pagination) => {
    setForm(values);
    setSelected([]);

    const { approved, all_topics, ...rest } = values;

    const { data, total } = await dataProvider.getList('questions', {
      filter: {
        ...rest,
        ...(approved !== '__none__' ? { approved } : {}),
        ...(all_topics ? {} : { fk_topicId: record.fk_topicId }),
      },
      pagination: paging,
    });

    setResults(data);
    setCount(total);
  };

  const setPage = (page, submit = true) => {
    setPagination({
      ...pagination,
      page: page + 1,
    });

    if (submit) {
      onSubmit(form, { perPage: pagination.perPage, page: page + 1 });
    }
  };

  const setPageSize = (val) => {
    setPagination({
      page: 1,
      perPage: val,
    });

    onSubmit(form, { perPage: val, page: 1 });
  };

  const createQuestion = async (values) => {
    try {
      await dataProvider.create('questions', {
        data: {
          ...values,
          fk_answerId: record.id,
          fk_languageId: record.fk_languageId,
          fk_topicId: record.fk_topicId,
        },
      });

      notify('The question was created and linked');
      start();
      refresh();
    } catch (err) {
      notify('Failed to create the question');
    }
  };

  const save = async () => {
    try {
      await Promise.all(
        selected.map((id) => {
          return dataProvider.update('questions', {
            id,
            data: {
              fk_answerId: record.id,
              fk_topicId: record.fk_topicId,
            },
          });
        }),
      );

      notify('The answer was linked');
      start();
      refresh();
    } catch (err) {
      notify(`Failed to link questions: ${err.message}`, 'error');
    }
  };

  return (
    <>
      <Filters
        onSubmit={(values) => {
          setPage(0, false);
          return onSubmit(values, { perPage: pagination.perPage, page: 1 });
        }}
        initialValues={form}
      />
      {
        !results && (
          <Box py={2}>
            <Alert severity="info">
              {translate('misc.search_filters_explanations')}
            </Alert>
          </Box>
        )
      }
      {
        results && !results.length && (
          <Box py={2}>
            <Alert severity="info">
              {translate('misc.no_records')}
            </Alert>
          </Box>
        )
      }
      {
        results && !!results.length && (
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
                  results.map((result, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Checkbox
                          checked={isSelected(result)}
                          value={isSelected(result)}
                          onClick={() => selectResult(result)}
                          disabled={boolDisabledEdit(permissions, result?.fk_topicId)}
                        />
                      </TableCell>
                      <TableCell>
                        <PlayableTextField source="text" record={{ ...result }} />
                      </TableCell>
                      <TableCell style={{ width: '50%' }}>
                        {
                          result.fk_answerId && (
                            <Text record={{ ...result.Answer, Language: result.Language }} />
                          )
                        }
                        {
                          !result.fk_answerId && ('-')
                        }
                      </TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
            <Box textAlign="right">
              <TablePagination
                component="div"
                count={count}
                page={pagination.page - 1}
                onChangePage={(e, value) => {
                  setPage(value);
                }}
                rowsPerPage={pagination.perPage}
                rowsPerPageOptions={[1, 5, 10, 15]}
                onChangeRowsPerPage={(e) => {
                  const value = parseInt(e.target.value, 10);
                  setPageSize(value);
                }}
              />
            </Box>
            <Box textAlign="right" py={2}>
              {
                !!selected.length && (
                  <Button
                    type="button"
                    onClick={save}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    {translate('resources.answers.link_questions', { val: selected.length })}
                  </Button>
                )
              }
            </Box>
          </>
        )
      }
      <hr />
      <CreateForm
        onSubmit={(v) => createQuestion(v)}
      />
    </>
  );
};

export default LinksDialog;
