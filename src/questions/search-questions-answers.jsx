import React from 'react';
import {
  useDataProvider,
  SelectInput,
  TextInput,
  BooleanInput,
  useNotify,
  Confirm,
} from 'react-admin';
import { Form } from 'react-final-form'; // eslint-disable-line
import TablePagination from '@material-ui/core/TablePagination';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Alert from '@material-ui/lab/Alert';
import { PlayableTextField } from '../common/components/playable-text';
import { MarkdownInput } from '../answers/form';
import { Text } from '../answers/AnswerList';

const Filters = ({ onSubmit, initialValues }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <TextInput label="Text" source="q" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <SelectInput
                  label="Search for"
                  source="type"
                  choices={[
                    { id: 'questions', name: 'Questions' },
                    { id: 'answers', name: 'Answers' },
                  ]}
                  fullWidth
                />
              </Grid>
              {
                values.type === 'questions' && (
                  <>
                    <Grid item xs={12} sm={4} md={3}>
                      <SelectInput
                        label="Approved"
                        source="approved"
                        choices={[
                          { id: '__none__', name: 'Both' },
                          { id: true, name: 'Only approved questions' },
                          { id: false, name: 'Only not-approved questions' },
                        ]}
                        fullWidth
                      />
                    </Grid>
                  </>
                )
              }
              <Grid item xs={12} sm={4} md={3}>
                <BooleanInput
                  label="All topics"
                  source="all_topics"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Box pt={2}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Search
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

const CreateForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{
      text: '',
    }}
    validate={(values) => {
      const errors = {};

      if (!values.text) {
        errors.text = 'Required';
      }

      return errors;
    }}
    render={({ handleSubmit, valid }) => (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MarkdownInput
              label="Text"
              source="text"
            />
          </Grid>
          <Grid item xs={12}>
            <Box pt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                disabled={!valid}
              >
                Create answer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    )}
  />
);

const LinksDialog = ({
  record,
  onSelected,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [results, setResults] = React.useState(null);
  const [pagination, setPagination] = React.useState({
    perPage: 5,
    page: 1,
  });
  const [form, setForm] = React.useState({
    q: '',
    type: 'questions',
    all_topics: false,
    approved: '__none__',
  });
  const [count, setCount] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const start = () => {
    setResults(null);
    setPagination({
      perPage: 5,
      page: 1,
    });
    setForm({
      q: '',
      type: 'questions',
      all_topics: false,
      approved: '__none__',
    });
    setSelected(null);
    setOpen(false);
  };

  React.useEffect(() => {
    start();
  }, []);

  if (!record) {
    return null;
  }

  const onSubmit = async (values, paging = pagination) => {
    setForm(values);

    const {
      type, approved, all_topics, ...rest
    } = values;

    const { data, total } = await dataProvider.getList(type, {
      filter: {
        ...rest,
        ...(approved !== '__none__' && type === 'questions' ? { approved } : {}),
        ...(
          all_topics ? {} : { fk_topicId: record.fk_topicId }
        ),
        ...(
          type === 'questions'
            ? { fk_answerId: '!NULL' }
            : {}
        ),
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

  const createAnswer = async (values) => {
    try {
      const { data } = await dataProvider.create('answers', {
        data: {
          ...values,
          fk_languageId: record.fk_languageId,
          fk_topicId: record.fk_topicId,
        },
      });

      onSelected(data.id);
      start();
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  const selectToLink = (result) => {
    if (result.fk_topicId !== record.fk_topicId) {
      setOpen(true);
      setSelected(result);

      return;
    }

    onSelected(result.fk_answerId || result.id, result.fk_topicId);
    start();
  };

  const onConfirm = () => {
    onSelected(selected.fk_answerId || selected.id, selected.fk_topicId);
    start();
  };

  const onClose = () => {
    setSelected(null);
    setOpen(false);
  };

  return (
    <>
      <Confirm
        isOpen={open}
        loading={false}
        title="Link"
        content="The selected record is linked to a different topic. Linking will change the question's topic. Proceed?"
        onConfirm={onConfirm}
        onClose={onClose}
      />
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
              Use the filters to search for answers or questions
            </Alert>
          </Box>
        )
      }
      {
        results && !results.length && (
          <Box py={2}>
            <Alert severity="info">
              No records were found
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
                  <TableCell>Text</TableCell>
                  {
                    form.type === 'questions' && (
                      <TableCell>Answer</TableCell>
                    )
                  }
                  <TableCell>&nbsp;</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  results.map((result, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {
                          form.type === 'questions' && (
                            <PlayableTextField
                              source="text"
                              record={{ ...result, Language: record.Language }}
                            />
                          )
                        }
                        {
                          form.type === 'answers' && (
                            <Text
                              record={{ ...result, Language: record.Language }}
                              hideRelatedQuestions
                            />
                          )
                        }
                      </TableCell>
                      {
                        form.type === 'questions' && (
                          <TableCell>
                            {
                              result.fk_answerId && (
                                <Text
                                  record={{ ...result.Answer, Language: result.Language }}
                                  hideRelatedQuestions
                                />
                              )
                            }
                          </TableCell>
                        )
                      }
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          type="button"
                          onClick={() => {
                            selectToLink(result);
                          }}
                        >
                          Link to answer
                        </Button>
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
          </>
        )
      }
      <hr />
      <CreateForm
        onSubmit={(v) => createAnswer(v)}
      />
    </>
  );
};

export default LinksDialog;
