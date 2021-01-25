import React from 'react';
import {
  useDataProvider,
  SelectInput,
  TextInput,
  required,
  useNotify,
  TextField,
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

const Filters = ({ onSubmit, initialValues }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
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
      )}
    />
  );
};

const CreateForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{
      text: '',
    }}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextInput label="Text" source="text" fullWidth validate={required()} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box pt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
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
    approved: '__none__',
  });
  const [count, setCount] = React.useState(0);

  const start = () => {
    setResults(null);
    setPagination({
      perPage: 5,
      page: 1,
    });
    setForm({
      q: '',
      type: 'questions',
      approved: '__none__',
    });
  };

  React.useEffect(() => {
    start();
  }, []);

  if (!record) {
    return null;
  }

  const onSubmit = async (values, paging = pagination) => {
    setForm(values);

    const { type, approved, ...rest } = values;

    const { data, total } = await dataProvider.getList(type, {
      filter: {
        ...rest,
        ...(approved !== '__none__' && type === 'questions' ? { approved } : {}),
        fk_topicId: record.fk_topicId,
      },
      pagination: paging,
    });

    const filtered = type === 'questions'
      ? data.filter((r) => !!r.fk_answerId)
      : data;

    setResults(filtered);
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
      notify('Failed to create the question');
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
                  <TableCell>Select</TableCell>
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
                        <PlayableTextField source="text" record={{ ...result, Language: record.Language }} />
                      </TableCell>
                      {
                        form.type === 'questions' && (
                          <TableCell>
                            <TextField source="Answer.text" record={result} />
                          </TableCell>
                        )
                      }
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          type="button"
                          onClick={() => {
                            onSelected(result.fk_answerId || result.id);
                            start();
                          }}
                        >
                          Link to question
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

      <CreateForm
        onSubmit={(v) => createAnswer(v)}
      />
    </>
  );
};

export default LinksDialog;
