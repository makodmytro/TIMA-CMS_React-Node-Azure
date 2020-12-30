import React from 'react';
import {
  Datagrid, DateField, List, ReferenceField, TextField,
} from 'react-admin';
import { connect } from 'react-redux';

const TopicList = ({ language, ...props }) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="fallbackTopicLevel" />
      <ReferenceField
        label="resources.topics.fields.language"
        source="fk_languageId"
        reference="languages"
      >
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField
        label="resources.topics.fields.editor"
        source="fk_editorId"
        reference="editors"
      >
        <TextField
          source="name"
        />
      </ReferenceField>
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

const mapStateToProps = (state) => ({
  language: state.lng.language,
});

export default connect(mapStateToProps)(TopicList);
