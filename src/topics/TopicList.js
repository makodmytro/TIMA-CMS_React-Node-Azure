import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceInput,
  SelectInput,
  TextField,
  Filter,
  TextInput,
} from 'react-admin';
import { Link } from 'react-router-dom'; // eslint-disable-line
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
      <ReferenceInput label="Language" source="fk_languageId" reference="languages" alwaysOn>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
      <ReferenceInput label="Editor" source="fk_editorId" reference="editors" alwaysOn perPage={100}>
        <SelectInput optionText="name" className={classes.select} allowEmpty emptyText="None" />
      </ReferenceInput>
    </Filter>
  );
};

const ShowQuestions = ({ record, size }) => (
  <Button
    component={Link}
    onClick={(e) => {
      e.stopPropagation();
    }}
    size={size || 'small'}
    color="primary"
    variant="outlined"
    style={{ marginLeft: '10px' }}
    to={`/questions?filter=${encodeURIComponent(JSON.stringify({ fk_topicId: record.id }))}`}
  >
    Show questions
  </Button>
);

const Img = ({ record }) => {
  if (!record.topicImageUrl) {
    return null;
  }

  return (
    <div>
      <img style={{ maxWidth: '200px' }} src={record.topicImageUrl} alt="topic" />
    </div>
  );
};

const TopicList = (props) => (
  <List {...props} filters={<Filters />} bulkActionButtons={false} sort={{ field: 'fk_languageId', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="topicKey" />
      <Img label="Image" />
      <DateField source="updatedAt" showTime />
      <ShowQuestions />
    </Datagrid>
  </List>
);

export { ShowQuestions, Img };
export default TopicList;
