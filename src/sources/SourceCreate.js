import React from 'react';
import {
  Create, ReferenceInput, required, SelectInput, SimpleForm, TextInput,
} from 'react-admin';

const SourceCreate = (props) => (
  <Create {...props}>
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
  </Create>
);

export default SourceCreate;
