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
import { useDisabledEdit } from '../../hooks';

export const Advanced = (props) => (
  <>
    <Typography>
      Advanced
    </Typography>
    <TextInput source="topicKey" record={props.record} fullWidth disabled={props.disabled === true} />
  </>
);

const FormFields = (props) => {
  const disabled = useDisabledEdit(props?.record?.id);

  const getLang = (r) => {
    if (!r || !props.languages[r.fk_languageId]) {
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
        disabled={disabled}
        record={props?.record}
      />
      <PlayableTextInput
        source="welcomeText"
        fullWidth
        rows="4"
        multiline
        lang={getLang}
        disabled={disabled}
        record={props?.record}
      />
      <ReferenceInput
        validate={required()}
        source="fk_languageId"
        reference="languages"
        label="resources.topics.fields.language"
        fullWidth
        disabled
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <TextInput source="topicImageUrl" fullWidth disabled={disabled} />
      <TopicImage {...props} />
      <Advanced source="topicKey" disabled={disabled} />
    </>
  );
};

export default FormFields;
