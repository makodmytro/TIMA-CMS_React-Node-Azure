import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from 'react-admin';
import AutocompleteInput from './autocomplete-input';
import AnswerCreateDialog from '../answers/create-dialog';

const FormFields = ({ open, setOpen, onAnswerCreated }) => (
  <>
    <AnswerCreateDialog
      open={open}
      onClose={() => setOpen(false)}
      onSuccess={onAnswerCreated}
    />
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
        fullWidth
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
  </>
);

export default FormFields;
