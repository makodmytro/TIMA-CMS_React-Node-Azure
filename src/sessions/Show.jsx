import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
} from 'react-admin';

const SessionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="clientIP" label="IP" />
      <TextField source="Language.name" label="Language" sortBy="fk_languageId" />
      <TextField source="Topic.name" label="Topic" sortBy="fk_topicId" />
      <DateField source="updatedAt" someTime />
    </SimpleShowLayout>
  </Show>
);

export default SessionShow;
