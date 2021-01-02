import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import {
  DateField,
  List,
  TextField,
  Filter,
  TextInput,
  ReferenceInput,
  SelectInput,
  EditButton,
  useListContext,
  useRedirect,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from '@material-ui/icons/Visibility';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import ArrowUp from '@material-ui/icons/ArrowUpward';

const styles = makeStyles((theme) => ({
  padded: {
    paddingTop: '1rem',
  },
  select: {
    minWidth: 150,
  },
  related: {
    color: theme.palette.primary.main,
    cursor: 'pointer',

    '& svg': {
      verticalAlign: 'middle',
      fontSize: '0.9rem',
    },
  },
  cursor: {
    cursor: 'pointer',
  },
  thead: {
    cursor: 'pointer',
    fontWeight: 'bold',

    '& svg': {
      fontSize: '0.8rem',
      verticalAlign: 'middle',
    },
  },
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <Filter {...props} className={classes.padded}>
      <TextInput label="Text" source="q" alwaysOn />
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
      <ReferenceInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
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
        to={`/questions/${record.id}`}
        size="small"
        style={{ color: 'red', borderColor: '#ff0000a6' }}
        variant="outlined"
        onClick={(e) => e.stopPropagation()}
      >
        <AddIcon />
        &nbsp;Create
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      to={`/answers/${record.fk_answerId}`}
      size="small"
      color="primary"
      onClick={(e) => e.stopPropagation()}
    >
      {
        record.Answer && (
          <>
            {record.Answer.text.substr(0, 40)}...
          </>
        )
      }
      {
        !record.Answer && (
          <>
            <ViewIcon />
            &nbsp;View
          </>
        )
      }
    </Button>
  );
};

const RelatedQuestions = ({ record, expanded, setExpanded }) => {
  const classes = styles();

  if (!record || !record.relatedQuestions || !record.relatedQuestions.length) {
    return (<>&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</>);
  }

  return (
    <span
      className={classes.related}
      onClick={(e) => {
        e.stopPropagation();
        setExpanded(!expanded);
      }}
    >
      {record.relatedQuestions.length}
      { expanded ? <ExpandLessIcon size="small" /> : <AddIcon size="small" />} { /* eslint-disable-line */ }
    </span>
  );
};

const CustomGridItem = ({ record, basePath }) => {
  const classes = styles();
  const redirect = useRedirect();
  const [expanded, setExpanded] = React.useState(false);

  const link = (id) => (e) => {
    e.stopPropagation();
    redirect(`/questions/${id}`);
  };

  return (
    <>
      <TableRow
        className={classes.cursor}
        style={{ backgroundColor: record.fk_answerId ? 'default' : '#ff000030' }}
        onClick={link(record.id)}
      >
        <TableCell>
          <RelatedQuestions record={record} expanded={expanded} setExpanded={setExpanded} />
          &nbsp;
          <TextField source="text" record={record} />
        </TableCell>
        <TableCell>
          <AnswerField label="Answer" record={record} />
        </TableCell>
        <TableCell>
          <DateField source="updatedAt" showTime record={record} />
        </TableCell>
        <TableCell>
          <EditButton basePath={basePath} record={record} />
        </TableCell>
      </TableRow>
      {
        expanded && (
          record.relatedQuestions.map((related, i) => (
            <TableRow
              className={classes.cursor}
              key={i}
              style={{ backgroundColor: '#fdfdd6' }}
              onClick={link(related.id)}
            >
              <TableCell>
                <TextField source="text" record={related} />
              </TableCell>
              <TableCell>
                <AnswerField label="Answer" record={related} />
              </TableCell>
              <TableCell>
                <DateField source="updatedAt" showTime record={related} />
              </TableCell>
              <TableCell>
                <EditButton basePath={basePath} record={related} />
              </TableCell>
            </TableRow>
          ))
        )
      }
    </>
  );
};

const CustomGrid = () => {
  const { ids, data, basePath, currentSort, setSort } = useListContext(); // eslint-disable-line
  const classes = styles();

  const Th = ({ label, field }) => (
    <TableCell className={classes.thead} onClick={() => setSort(field, currentSort.order === 'ASC' ? 'DESC' : 'ASC')}>
      {label}&nbsp;
      {
        field === currentSort.field && currentSort.order === 'DESC' && (
          <ArrowUp size="small" />
        )
      }
      {
        field === currentSort.field && currentSort.order === 'ASC' && (
          <ArrowDown size="small" />
        )
      }
    </TableCell>
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box my={1}>
          <Table>
            <TableHead>
              <TableRow>
                <Th label="Text" field="text" />
                <Th label="Answer" field="fk_answerId" />
                <Th label="Updated at" field="updatedAt" />
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                ids.map((id) => (
                  <CustomGridItem key={id} record={data[id]} basePath={basePath} />
                ))
              }
            </TableBody>
          </Table>
        </Box>
      </Grid>
    </Grid>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<Filters />}>
    <CustomGrid />
  </List>
);

export default QuestionList;
