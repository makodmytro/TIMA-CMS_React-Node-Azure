import React from 'react';
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
  Filter,
  TextInput,
  ReferenceArrayInput,
  SelectArrayInput,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

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
      <ReferenceArrayInput label="Editor" source="fk_editorId" reference="editors" alwaysOn perPage={100}>
        <SelectArrayInput optionText="name" className={classes.select} />
      </ReferenceArrayInput>
    </Filter>
  );
};

const TopicList = ({ language, ...props }) => (
  <List {...props} filters={<Filters />}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="fallbackTopicLevel" />
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="Editor.name" label="Editor" sortBy="fk_editorId" />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);

const mapStateToProps = (state) => ({
  language: state.lng.language,
});

export default connect(mapStateToProps)(TopicList);
