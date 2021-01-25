import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  useDataProvider,
  useRefresh,
  SelectInput,
  TextInput,
  required,
  useNotify,
  TextField,
} from 'react-admin';
import Checkbox from '@material-ui/core/Checkbox';
import { Form } from 'react-final-form'; // eslint-disable-line
import TablePagination from '@material-ui/core/TablePagination';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
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
import RelatedQuestionsTable from './related-questions-table';

function TabPanel(props) {
  const {
    children,
    value,
    index,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={2}>{children}</Box>
      )}
    </div>
  );
}

const styles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  title: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  danger: {
    color: 'red',
    borderColor: 'red',
  },
}));

const Filters = ({ onSubmit, initialValues }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <TextInput label="Text" source="q" fullWidth validate={required()} />
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
  open,
  onClose,
  deleteQuestion,
  removeAnswer,
}) => {
  const classes = styles();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [relatedQuestions, setRelatedQuestions] = React.useState([]);
  const [results, setResults] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
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
  const [tab, onTabChange] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setResults(null);
      setSelected(null);
      setPagination({
        perPage: 5,
        page: 1,
      });
      setForm({
        q: '',
        type: 'questions',
        approved: '__none__',
      });
    }
  }, [open]);

  const fetchRelatedQuestions = async () => {
    if (!record.fk_answerId) {
      return;
    }

    const { data } = await dataProvider.getList('answers', {
      filter: {
        id: record.fk_answerId,
      },
      include: ['Questions'],
    });

    if (!data.length) {
      return;
    }

    setRelatedQuestions(data[0].Questions);
  };

  React.useEffect(() => {
    if (record) {
      fetchRelatedQuestions();
    }
  }, [record]);

  if (!record) {
    return null;
  }

  const onSubmit = async (values, paging = pagination) => {
    setSelected(null);
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

  const removeAnswerLocal = async () => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId: null },
      });

      notify('The answer was unlinked from the question');
      refresh();
      onClose();
    } catch (err) {
      notify(`Failed to remove the answer: ${err.message}`, 'error');
    }
  };

  const isSelected = (result) => result.id === selected;
  const selectResult = (result) => {
    if (isSelected(result)) {
      setSelected(null);
    } else {
      setSelected(result.id);
    }
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

  const save = async () => {
    try {
      const result = results.find((r) => r.id === selected);

      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId: result.fk_answerId || result.id },
      });

      notify('The question was linked');
      onClose();
      refresh();
    } catch (err) {
      notify(`Failed to link question: ${err.message}`, 'error');
    }
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

      await dataProvider.update('questions', {
        id: record.id,
        data: { fk_answerId: data.id },
      });

      notify('The answer was created and the question linked');
      onClose();
      refresh();
    } catch (err) {
      notify('Failed to create the question');
    }
  };

  return (
    <>
      <Dialog onClose={onClose} open={open} maxWidth="lg" fullWidth className={classes.root} disableBackdropClick disableEscapeKeyDown>
        <DialogTitle disableTypography className={classes.title}>
          <Typography variant="h6">Links</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className={classes.content}>
          <AppBar position="static" color="default">
            <Tabs value={tab} onChange={(e, v) => onTabChange(v)} indicatorColor="primary" textColor="primary" variant="fullWidth">
              <Tab label="Search questions/answers" />
              <Tab label="Create new answer" />
              <Tab label="Related questions" />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            {
              record.fk_answerId && (
                <Box textAlign="right">
                  <Button
                    onClick={removeAnswerLocal}
                    variant="outlined"
                    size="small"
                    type="button"
                    className={classes.danger}
                  >
                    Unlink answer
                  </Button>
                  <hr />
                </Box>
              )
            }
            <Filters
              onSubmit={(values) => {
                setPage(0, false);
                onSubmit(values, { perPage: pagination.perPage, page: 1 });
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
                              />
                            </TableCell>
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
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CreateForm
              onSubmit={(v) => createAnswer(v)}
            />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <RelatedQuestionsTable
              record={record}
              relatedQuestions={relatedQuestions}
              deleteQuestion={deleteQuestion}
              removeAnswer={removeAnswer}
            />
          </TabPanel>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            type="button"
            onClick={save}
            variant="outlined"
            color="primary"
            disabled={!selected}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={onClose}
            variant="contained"
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LinksDialog;
