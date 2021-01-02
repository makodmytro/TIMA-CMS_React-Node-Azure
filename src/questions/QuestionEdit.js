import React from 'react';
import {
  Edit, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import AutocompleteInput from './autocomplete-input';

const QuestionEdit = (props) => (
  <Edit {...props} actions={<CustomTopToolbar />} undoable={false}>
    <SimpleForm>
      <TextInput source="text" validate={required()} fullWidth />
      <ReferenceInput
        source="fk_languageId"
        reference="languages"
        validate={required()}
        fullWidth
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <ReferenceInput
        source="fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <AutocompleteInput />
      <ReferenceInput allowEmpty source="fk_parentQuestionId" reference="questions" fullWidth>
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
        />
      </ReferenceInput>
      <ReferenceInput allowEmpty source="fk_questionId" reference="questions" fullWidth>
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
        />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export default QuestionEdit;
