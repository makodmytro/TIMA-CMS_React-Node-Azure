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
import ExpandIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
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
        color="primary"
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
      <ViewIcon />
      &nbsp;View
    </Button>
  );
};

const RelatedQuestions = ({ record, expanded, setExpanded }) => {
  if (!record.relatedQuestions.length) {
    return (<>-</>);
  }

  return (
    <Button
      size="small"
      color="primary"
      onClick={() => setExpanded(!expanded)}
      type="button"
    >
      {record.relatedQuestions.length}
      &nbsp;{ expanded ? <ExpandLessIcon /> : <ExpandIcon />} { /* eslint-disable-line */ }
    </Button>
  );
};

const CustomGridItem = ({ record, basePath }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <TextField source="text" record={record} />
        </TableCell>
        <TableCell>
          <AnswerField label="Answer" record={record} />
        </TableCell>
        <TableCell align="center">
          <RelatedQuestions record={record} expanded={expanded} setExpanded={setExpanded} />
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
              <TableCell align="center">-</TableCell>
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
  const { ids, data, basePath, ...rest } = useListContext(); // eslint-disable-line
  console.log(rest);
  React.useEffect(() => {
    rest.onSelect([ids[0]]);
  }, []);

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

const QuestionList = (props) => (
  <List {...props} filters={<Filters />}>
    <CustomGrid />
  </List>
);

export default QuestionList;
