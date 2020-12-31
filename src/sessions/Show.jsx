import * as React from 'react';
import {
  TextField,
  DateField,
  useDataProvider,
  useRedirect,
  useNotify,
} from 'react-admin';
import { useParams, Link } from 'react-router-dom'; // eslint-disable-line
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.main,

    '&:visited': {
      color: theme.palette.primary.main,
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
      target="_blank"
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
      <>-</>
    );
  }

  return (
    <Link
      to={`/answers/${record.fk_answerId}`}
      target="_blank"
      className={classes.link}
    >
      {record.answerText}
    </Link>
  );
};

const SessionShow = () => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const params = useParams();
  const notify = useNotify();
  const [records, setRecords] = React.useState(null);

  const fetch = async () => {
    try {
      const { data } = await dataProvider.getList(`stats/sessions/${params.id}`);

      if (!data.length) {
        redirect('/stats/sessions');
      }

      setRecords(data);
    } catch (err) {
      notify(err.message);
    }
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
    <Box my={2} boxShadow={1}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Created</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell>Question</TableCell>
            <TableCell>Answer</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            records.map((record, i) => (
              <TableRow key={i}>
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
  );
};

export default SessionShow;
