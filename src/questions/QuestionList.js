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
  ReferenceInput,
  SelectInput,
  SelectArrayInput,
  EditButton,
  useListContext,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ViewIcon from '@material-ui/icons/Visibility';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/core/styles';
import { Form } from 'react-final-form'; // eslint-disable-line
import { InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ContentFilter from '@material-ui/icons/FilterList';

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
}));

const Filters = (props) => {
  const classes = styles();

  return (
    <Filter {...props} className={classes.padded}>
      <TextInput label="Text" source="q" alwaysOn />
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} />
      </ReferenceInput>
      <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} />
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
        style={{ color: 'red', borderColor: '#ff0000a6' }}
        variant="outlined"
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

  if (!record.relatedQuestions.length) {
    return (<>&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;</>);
  }

  return (
    <span
      className={classes.related}
      onClick={() => setExpanded(!expanded)}
    >
      {record.relatedQuestions.length}
      { expanded ? <ExpandLessIcon size="small" /> : <AddIcon size="small" />} { /* eslint-disable-line */ }
    </span>
  );
};

const CustomGridItem = ({ record, basePath }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <TableRow style={{ backgroundColor: record.fk_answerId ? 'default' : '#ff000030' }}>
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
            <TableRow key={i} style={{ backgroundColor: '#fdfdd6' }}>
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
  const { ids, data, basePath } = useListContext(); // eslint-disable-line

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box my={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Text</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell>Related questions</TableCell>
                <TableCell>Updated at</TableCell>
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

const PostFilter = (props) => { // eslint-disable-line
  return props.context === 'button' ? (
    null
  ) : (
    <PostFilterForm {...props} />
  );
};

const PostFilterButton = () => {
  const { showFilter } = useListContext();
  return (
    <Button
      size="small"
      color="primary"
      onClick={() => showFilter('main')}
      startIcon={<ContentFilter />}
    >
      Filter
    </Button>
  );
};

const PostFilterForm = ({ open }) => {
  const classes = styles();
  const {
    filterValues,
    setFilters,
    resource,
  } = useListContext();

  const onSubmit = (values) => {
    setFilters(values);
  };

  const resetFilter = () => {
    setFilters({}, []);
  };

  return (
    <div>
      <Form onSubmit={onSubmit} initialValues={filterValues}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={6} lg={3}>
                <TextInput label="Text" source="q" alwaysOn fullWidth />
              </Grid>
              <Grid item xs={6} lg={3}>
                <ReferenceInput label="Language" source="fk_languageId" reference="languages" resource={resource} allowEmpty alwaysOn>
                  <SelectInput optionText="name" className={classes.select} allowEmpty fullWidth />
                </ReferenceInput>
              </Grid>
              <Grid item xs={6} lg={3}>
                <ReferenceArrayInput label="Topic" source="fk_topicId" reference="topics" resource={resource} alwaysOn allowEmpty perPage={100}>
                  <SelectInput optionText="name" className={classes.select} fullWidth allowEmpty />
                </ReferenceArrayInput>
              </Grid>
              <Grid item xs={6} lg={3}>
                <Box py={2}>
                  <Button variant="contained" color="secondary" type="submit" size="small">
                    Filter
                  </Button>
                  &nbsp;
                  <Button variant="outlined" onClick={resetFilter} size="small">
                    Clear
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Form>
    </div>
  );
};

const QuestionList = (props) => (
  <List {...props} filters={<PostFilter />}>
    <CustomGrid />
  </List>
);

export default QuestionList;
