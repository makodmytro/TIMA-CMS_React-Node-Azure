import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
} from 'react-admin';
import Typography from '@material-ui/core/Typography';
import TopicImage from './Image';
import { PlayableTextInput } from '../../common/components/playable-text';
import { useDisabledEdit, useIsAdmin } from '../../hooks';

export const Advanced = (props) => (
  <>
    <Typography>
      Advanced
    </Typography>
    <TextInput source="topicKey" record={props.record} fullWidth disabled={props.disabled === true} />
  </>
);

export const Qna = (props) => (
  <>
    <Typography>
      QNA
    </Typography>
    <TextInput source="qnaApiVersion" label="Version" record={props.record} fullWidth disabled={props.disabled === true} />
    <TextInput source="qnaSubscriptionKey" label="Subscription key" record={props.record} fullWidth disabled={props.disabled === true} />
    <TextInput source="qnaKnowledgeBaseId" label="Knowledge base ID" record={props.record} fullWidth disabled={props.disabled === true} />
  </>
);

const FormFields = (props) => {
  const disabled = useDisabledEdit(props?.record?.id);
  const admin = useIsAdmin();

  const getLang = (r) => {
    if (!r || !r.fk_languageId || !props.languages[r.fk_languageId]) {
      return null;
    }

    return props.languages[r.fk_languageId].code;
  };

  return (
    <>
      <PlayableTextInput
        source="name"
        validate={required()}
        fullWidth
        lang={getLang}
        disabled={disabled && !admin}
        record={props?.record}
      />
      <PlayableTextInput
        source="welcomeText"
        fullWidth
        rows="4"
        multiline
        lang={getLang}
        disabled={disabled && !admin}
        record={props?.record}
      />
      <ReferenceInput
        validate={required()}
        source="fk_languageId"
        reference="languages"
        label="resources.topics.fields.language"
        fullWidth
        disabled={disabled && !admin}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <TextInput source="topicImageUrl" fullWidth disabled={disabled && !admin} />
      <TopicImage {...props} />
      <ReferenceInput source="fk_parentTopicId" reference="topics" label="Parent topic" fullWidth disabled={props.disabled === true} allowEmpty>
        <SelectInput
          optionText="name"
          allowEmpty
          emptyText="None"
        />
      </ReferenceInput>
      <TextInput source="level" fullWidth disabled />
      <Advanced source="topicKey" disabled={disabled && !admin} />
      <Qna {...props} disabled={disabled && !admin} />
    </>
  );
};

export default FormFields;
