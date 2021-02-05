import * as React from 'react';
import orderBy from 'lodash/orderBy';
import {
  TextField,
  DateField,
  useDataProvider,
  useRedirect,
  useNotify,
} from 'react-admin';
import { useParams, Link } from 'react-router-dom'; // eslint-disable-line
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';
import CustomTopToolbar from '../common/components/custom-top-toolbar';

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
}));

const QuestionLink = ({ record }) => {
  const classes = styles();

  if (!record.questionText) {
    return (
      <>-</>
    );
  }

  return (
    <Link
      to={`/questions/${record.fk_questionId}`}
      className={classes.link}
    >
      {record.questionText}
    </Link>
  );
};

const AnswerLink = ({ record }) => {
  const classes = styles();

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
        &nbsp;Create
      </Button>
    );
  }

  return (
    <Link
      to={`/answers/${record.fk_answerId}`}
      className={classes.link}
    >
      {record.answerText.substr(0, 100)}...
    </Link>
  );
};

const SessionShow = () => {
  const classes = styles();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const params = useParams();
  const notify = useNotify();
  const [records, setRecords] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [sortDir, setSortDir] = React.useState(true);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList(`stats/sessions/${params.id}`);

      if (!data.length) {
        redirect('/stats/sessions');
      }

      setRecords(data);
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
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

  const SortableHeader = ({ label, field }) => (
    <TableCell className={classes.thead} onClick={() => setSort(field)}>
      {label}&nbsp;
      {
        field === sortBy && sortDir === true && (
          <ArrowUp size="small" />
        )
      }
      {
        field === sortBy && sortDir === false && (
          <ArrowDown size="small" />
        )
      }
    </TableCell>
  );

  return (
    <>
      <CustomTopToolbar />
      <Box mb={2} boxShadow={1}>
        <Table>
          <TableHead>
            <TableRow>
              <SortableHeader label="Created" field="createdAt" />
              <SortableHeader label="Topic" field="topicName" />
              <SortableHeader label="Question" field="questionText" />
              <SortableHeader label="Answer" field="answerText" />
              <SortableHeader label="Score" field="score" />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              records.map((record, i) => (
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
              ))
            }
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default SessionShow;
