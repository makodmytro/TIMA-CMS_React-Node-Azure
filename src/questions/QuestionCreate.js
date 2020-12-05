import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const QuestionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="text" validate={required()} />
      <ReferenceInput
        source="fk_languageId"
        reference="languages"
        validate={required()}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <ReferenceInput
        source="fk_topicId"
        reference="topics"
        validate={required()}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <ReferenceInput source="fk_answerId" reference="answers">
        <SelectInput
          optionText="text"
        />
      </ReferenceInput>
      <ReferenceInput allowEmpty source="fk_parentQuestionId" reference="questions">
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
        />
      </ReferenceInput>
      <ReferenceInput allowEmpty source="fk_questionId" reference="questions">
        <SelectInput
          allowEmpty
          resettable
          emptyValue={null}
          optionText="text"
        />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export default QuestionCreate;
