import React from 'react';
import {
  Edit,
  ReferenceInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
  SaveButton,
} from 'react-admin';
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { ShowQuestions, Img } from './TopicList';
import { PlayableTextInput } from '../common/components/playable-text';
import QrDialog from './qr-dialog';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => (
  <Toolbar {...props}>
    <SaveButton
      label="Save"
      redirect="list"
      submitOnEnter
    />
    &nbsp;
    <ShowQuestions size="medium" ml={1} />
    <QrDialog ml={1} />
  </Toolbar>
);

const TopicEdit = ({ languages, dispatch, ...props }) => {
  const getLang = (r) => {
    if (!r || !languages[r.fk_languageId]) {
      return null;
    }

    return languages[r.fk_languageId].code;
  };

  return (
    <Edit {...props} title={<TopicTitle />} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar />}>
        <PlayableTextInput
          source="name"
          validate={required()}
          fullWidth
          lang={getLang}
        />
        <TextInput source="topicKey" fullWidth />
        <TextInput source="topicImageUrl" fullWidth />
        <Img />
        <ReferenceInput
          validate={required()}
          source="fk_languageId"
          reference="languages"
          label="resources.topics.fields.language"
          fullWidth
        >
          <SelectInput
            optionText="name"
          />
        </ReferenceInput>
        <PlayableTextInput
          source="welcomeText"
          fullWidth
          lang={getLang}
        />
      </SimpleForm>
    </Edit>
  );
};

const mapStateToProps = (state) => ({
  languages: state.admin.resources.languages.data,
});

export default connect(mapStateToProps)(TopicEdit);
