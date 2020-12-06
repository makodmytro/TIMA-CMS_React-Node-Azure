import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';
import SourceKeywordEdit from './SourceKeywordEdit';

const SourceTitle = ({ record }) => (record ? <span>{record.text}</span> : null);

const SourceEdit = (props) => (
  <Edit title={<SourceTitle />} aside={<SourceKeywordEdit />} {...props}>
    <SimpleForm>
      <ReferenceInput
        source="fk_languageId"
        reference="languages"
        validate={required()}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <TextInput multiline fullWidth source="text" validate={required()} />
    </SimpleForm>
  </Edit>
);

export default SourceEdit;
