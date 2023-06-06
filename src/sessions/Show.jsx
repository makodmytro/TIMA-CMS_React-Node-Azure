import * as React from 'react';
import orderBy from 'lodash/orderBy';
import { TextField, DateField, useDataProvider, useRedirect, useNotify, useTranslate } from 'react-admin';
import { useParams, Link } from 'react-router-dom'; // eslint-disable-line
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import { format } from 'date-fns';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Logo from '../assets/TIMA_logo.png';

const styles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,

    '&:visited': {
      color: theme.palette.primary.main,
    },
  },
  thead: {
    fontWeight: 'bold',
    cursor: 'pointer',
    paddingLeft: '5px',
    paddingRight: '5px',

    '& svg': {
      fontSize: '0.8rem',
    },
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  date: {
    fontSize: '0.8rem',
    marginRight: '5px',
  },
  input: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    borderRadius: '15px',
    padding: theme.spacing(2),
    maxWidth: '45%',

    '&:after': {
      content: '',
      width: '100%',
    },
  },
  output: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    borderRadius: '15px',
    padding: theme.spacing(2),
    maxWidth: '45%',
    marginBottom: theme.spacing(1),

    '& a': {
      color: 'white !important',
    },
  },
  resourceLink: {
    fontSize: '0.7rem',

    '& a': {
      color: 'white !important',
    },
  },
}));

const QuestionLink = ({ record }) => {
  const classes = styles();

  if (!record.questionText) {
    return <>-</>;
  }

  return (
    <Link to={`/questions/${record.fk_questionId}`} className={classes.link}>
      {record.questionText}
    </Link>
  );
};

const AnswerLink = ({ record }) => {
  const classes = styles();
  const translate = useTranslate();

  if (!record.answerText) {
    return (
      <Button
        component={Link}
        to={`/questions/${record.fk_questionId}`}
        size="small"
        style={{ color: 'red', borderColor: '#ff0000a6' }}
        variant="outlined"
      >
        <AddIcon />
        &nbsp;{translate('misc.create')}
      </Button>
    );
  }

  return (
    <Link to={`/answers/${record.fk_answerId}`} className={classes.link}>
      {record.answerText.substr(0, 100)}...
    </Link>
  );
};

const TableView = ({ records, setSort, sortBy, sortDir }) => {
  const classes = styles();
  const translate = useTranslate();

  const SortableHeader = ({ label, field }) => (
    <TableCell className={classes.thead} onClick={() => setSort(field)}>
      {translate(label)}&nbsp;
      {field === sortBy && sortDir === true && <ArrowUp size="small" />}
      {field === sortBy && sortDir === false && <ArrowDown size="small" />}
    </TableCell>
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <SortableHeader label="resources.sessions.fields.timestamp" field="timestamp" />
          <SortableHeader label="resources.sessions.fields.topicName" field="topicName" />
          <SortableHeader label="resources.sessions.fields.questionText" field="questionText" />
          <SortableHeader label="resources.sessions.fields.answerText" field="answerText" />
          <SortableHeader label="resources.sessions.fields.score" field="score" />
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((record, i) => (
          <TableRow key={i} style={{ backgroundColor: record.fk_answerId ? 'transparent' : '#ff000030' }}>
            <TableCell>
              <DateField source="createdAt" record={record} showTime />
            </TableCell>
            <TableCell>
              <TextField source="topicName" record={record} />
            </TableCell>
            <TableCell>
              <QuestionLink record={record} />
            </TableCell>
            <TableCell>
              <AnswerLink record={record} />
            </TableCell>
            <TableCell>
              <TextField source="score" record={record} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ChatView = ({ records }) => {
  const classes = styles();
  const translate = useTranslate();

  return (
    <Box p={2}>
      {records.map((record, i) => (
        <Box key={i} my={2}>
          <Box mt={1} className={classes.inputContainer}>
            <div className={classes.input}>
              <Typography component="span">{record.inputText}</Typography>
              {record.fk_questionId && (
                <Typography align="right" className={classes.resourceLink}>
                  <Link to={`/questions/${record.fk_questionId}`}>[{translate('misc.view')}]</Link>
                </Typography>
              )}
            </div>
          </Box>
          <Box className={classes.inputContainer}>
            <Typography variant="body2" component="div" className={classes.date}>
              {format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm')}
            </Typography>
          </Box>
          <Box mt={1}>
            <img src={Logo} alt="logo" width="60px" />
            <div className={classes.output}>
              <Typography component="span">{record.outputText}</Typography>
              {record.fk_answerId && (
                <Typography className={classes.resourceLink}>
                  <Link to={`/answers/${record.fk_answerId}`}>[{translate('misc.view')}]</Link>
                </Typography>
              )}
            </div>
            {record.suggestedQuestions && !!record.suggestedQuestions.length && (
              <>
                <div className={classes.output}>
                  <Typography component="span">
                    {record.suggestedQuestions.map((sq, ii) => (
                      <span key={ii}>
                        <Link to={`/questions/${sq.id}`}>
                          {ii + 1}. {sq.text}
                        </Link>
                        <br />
                      </span>
                    ))}
                  </Typography>
                </div>
              </>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const SessionShow = () => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const params = useParams();
  const notify = useNotify();
  const translate = useTranslate();
  const [form, setForm] = React.useState({ chat: true });
  const [records, setRecords] = React.useState(null);
  const [sortBy, setSortBy] = React.useState('timestamp');
  const [sortDir, setSortDir] = React.useState(true);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList(`stats/sessions/${params.id}?limit=500`);

      const extended = data.map((d) => ({
        ...d,
        timestamp: +new Date(d.createdAt),
      }));

      setRecords(orderBy(extended, [sortBy], [sortDir ? 'asc' : 'desc']));
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  const setSort = (field) => {
    if (sortBy === field) {
      setSortDir(!sortDir);
    } else {
      setSortBy(field);
      setSortDir(true);
    }

    setRecords(orderBy(records, [sortBy], [sortDir ? 'asc' : 'desc']));
  };

  React.useEffect(() => {
    if (!params.id) {
      redirect('/stats/sessions');
    }

    fetch();
  }, []);

  if (!records) {
    return (
      <Box p={1} textAlign="center">
        Loading...
      </Box>
    );
  }

  return (
    <>
      <CustomTopToolbar />
      <FormGroup row>
        <FormControlLabel
          control={<Switch value={form.chat} checked={form.chat} onChange={(e) => setForm({ chat: e.target.checked })} />}
          label={translate('resources.sessions.chat_view')}
        />
      </FormGroup>
      <Box mb={2} boxShadow={3}>
        {!form.chat && <TableView records={records} setSort={setSort} sortBy={sortBy} sortDir={sortDir} />}
        {form.chat && <ChatView records={records} />}
      </Box>
    </>
  );
};

export default SessionShow;
