import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
  useTranslate,
} from 'react-admin';
import Typography from '@material-ui/core/Typography';
import TopicImage from './Image';
import { PlayableTextInput } from '../../common/components/playable-text';
import { useDisabledEdit, useIsAdmin } from '../../hooks';

export const Advanced = (props) => {
  const translate = useTranslate();

  return (
    <>
      <Typography>
        {translate('misc.advanced')}
      </Typography>
      <TextInput
        source="topicKey"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
        label="resources.topics.fields.topicKey"
      />
    </>
  );
};

export const Qna = (props) => {
  const translate = useTranslate();

  return (
    <>
      <Typography>
        {translate('misc.qna')}
      </Typography>
      <TextInput
        source="qnaMetadataKey"
        label="resources.topics.fields.qnaMetadataKey"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      <TextInput
        source="qnaMetadataValue"
        label="resources.topics.fields.qnaMetadataValue"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
       <TextInput
        source="qnaApiEndpoint"
        label="resources.topics.fields.qnaApiEndpoint"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      <TextInput
        source="qnaApiVersion"
        label="resources.topics.fields.qnaApiVersion"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      <TextInput
        source="qnaSubscriptionKey"
        label="resources.topics.fields.qnaSubscriptionKey"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      <TextInput
        source="qnaKnowledgeBaseId"
        label="resources.topics.fields.qnaKnowledgeBaseId"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
    </>
  );
};

const FormFields = (props) => {
  const disabled = useDisabledEdit(props?.record?.id);
  const admin = useIsAdmin();

  const isENBW = process.env.REACT_APP_TIMA_ENVIRONMENT === 'ENBW';

  const getLang = (r) => {
    if (!r || !r.fk_languageId || !props.languages[r.fk_languageId]) {
      return null;
    }

    return props.languages[r.fk_languageId].code;
  };

  return (
    <>env: {process.env.TIMA_ENVIRONMENT}*
      <PlayableTextInput
        source="name"
        validate={required()}
        fullWidth
        lang={getLang}
        disabled={disabled && !admin}
        record={props?.record}
        label="resources.topics.fields.name"
      />
      { isENBW ? null : (
        <PlayableTextInput
          source="welcomeText"
          fullWidth
          rows="4"
          multiline
          lang={getLang}
          disabled={disabled && !admin}
          record={props?.record}
          label="resources.topics.fields.welcomeText"
        />
      )}
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
      { isENBW ? null : (
        <TextInput
          source="topicImageUrl"
          fullWidth
          disabled={disabled && !admin}
          label="resources.topics.fields.image"
        />
      )}
      { isENBW ? null : <TopicImage {...props} />}
      <ReferenceInput
        source="fk_parentTopicId"
        reference="topics"
        label="resources.topics.fields.fk_parentTopicId"
        fullWidth
        disabled={props.disabled === true}
        allowEmpty
      >
        <SelectInput
          optionText="name"
          allowEmpty
          emptyText="None"
        />
      </ReferenceInput>
      { //<TextInput source="level" label="resources.topics.fields.level" fullWidth disabled />
       }
      { isENBW ? null : <Advanced source="topicKey" disabled={disabled && !admin} />}
      <Qna {...props} disabled={disabled && !admin} />
    </>
  );
};

export default FormFields;
