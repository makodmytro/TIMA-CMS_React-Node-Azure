import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  useDataProvider,
  useRefresh,
  SelectInput,
  TextInput,
  required,
  useNotify,
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
                Create question
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
}) => {
  const classes = styles();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [results, setResults] = React.useState(null);
  const [selected, setSelected] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    perPage: 5,
    page: 1,
  });
  const [form, setForm] = React.useState({
    q: '',
    approved: '__none__',
  });
  const [count, setCount] = React.useState(0);
  const [tab, onTabChange] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      setResults(null);
      setSelected([]);
      setPagination({
        perPage: 5,
        page: 1,
      });
      setForm({
        q: '',
        approved: '__none__',
      });
    }
  }, [open]);

  if (!record) {
    return null;
  }

  const onSubmit = async (values, paging = pagination) => {
    setForm(values);

    const { approved, ...rest } = values;

    const { data, total } = await dataProvider.getList('questions', {
      filter: {
        ...rest,
        ...(approved !== '__none__' ? { approved } : {}),
        fk_topicId: record.fk_topicId,
        fk_languageId: record.fk_languageId,
      },
      pagination: paging,
    });

    setResults(data);
    setCount(total);
  };

  const isSelected = (result) => selected.includes(result.id);
  const selectResult = (result) => {
    if (isSelected(result)) {
      setSelected(selected.filter((s) => s !== result.id));
    } else {
      setSelected(selected.concat([result.id]));
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
      await Promise.all(
        selected.map((id) => {
          return dataProvider.update('questions', {
            id,
            data: {
              fk_answerId: record.id,
            },
          });
        }),
      );

      notify('The questions were linked');
      onClose();
      refresh();
    } catch (err) {
      notify(`Failed to link questions: ${err.message}`, 'error');
    }
  };

  const createQuestion = async (values) => {
    try {
      await dataProvider.create('questions', {
        data: {
          ...values,
          fk_languageId: record.fk_languageId,
          fk_topicId: record.fk_topicId,
          fk_answerId: record.id,
        },
      });

      notify('The question was created and linked');
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
              <Tab label="Search questions" />
              <Tab label="Create new question" />
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <Filters
              onSubmit={(values) => {
                setSelected([]);
                setPage(0, false);
                onSubmit(values, { perPage: pagination.perPage, page: 1 });
              }}
              initialValues={form}
            />
            {
              !!selected.length && (
                <Alert severity="info" onClose={() => setSelected([])}>
                  {selected.length} selected
                </Alert>
              )
            }
            {
              !results && (
                <Box py={2}>
                  <Alert severity="info">
                    Use the filters to search for questions
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
                        <TableCell>Answer</TableCell>
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
                              <PlayableTextField source="text" record={result} />
                            </TableCell>
                            <TableCell>
                              {
                                result.fk_answerId && (
                                  <PlayableTextField source="text" record={{ ...result.Answer, Language: result.Language }} />
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
                </>
              )
            }
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <CreateForm
              onSubmit={createQuestion}
            />
          </TabPanel>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button
            type="button"
            onClick={save}
            variant="outlined"
            color="primary"
            disabled={!selected.length}
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
