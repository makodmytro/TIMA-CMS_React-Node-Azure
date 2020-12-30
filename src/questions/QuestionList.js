import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  Datagrid,
  DateField,
  List,
  TextField,
  Filter,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
  EditButton,
} from 'react-admin';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(() => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <Filter {...props} className={classes.padded}>
      <TextInput label="Text" source="q" alwaysOn />
      <ReferenceArrayInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const AnswerField = ({ record }) => {
  if (!record) {
    return null;
  }

  if (!record.fk_answerId) {
    return (
      <Button
        component={Link}
        to="/answers/create"
        size="small"
        variant="outlined"
      >
        Create answer
      </Button>
    );
  }

  return (
    <Link to={`/answers/${record.Answer.id}`}>
      <Typography variant="body2">{record.Answer.id}</Typography>
    </Link>
  );
};

const RelatedQuestions = ({ record }) => {
  if (!record || !record.relatedQuestions) {
    return null;
  }

  return (
    <Typography variant="body2">
      {record.relatedQuestions.length}
    </Typography>
  );
};

const Expanded = ({ record }) => {
  if (!record.relatedQuestions.length) {
    return (
      <Box p={2}>
        <Typography variant="body2">There are no related questions</Typography>
      </Box>
    );
  }

  // const t = [{ id: 1, text: 'Related question 1' }, { id: 2, text: 'Related question 2' }];

  return (
    <Table>
      <TableBody>
        {
          record.relatedQuestions.map((rel, i) => (
            <TableRow key={i}>
              <TableCell>&nbsp;</TableCell>
              <TableCell>{rel.id}</TableCell>
              <TableCell>{rel.text}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />}>
    <Datagrid rowClick={null} expand={Expanded}>
      <TextField source="text" />
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="Topic.name" label="Topic" sortBy="fk_topicId" />
      <AnswerField label="Answer" />
      <RelatedQuestions label="Related questions" />
      <DateField source="updatedAt" />
      <EditButton />
    </Datagrid>
  </List>
);

export default QuestionList;
