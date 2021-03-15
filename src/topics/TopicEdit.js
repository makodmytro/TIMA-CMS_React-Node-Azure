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
  DeleteButton,
  usePermissions,
} from 'react-admin';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { ShowQuestions, Img } from './TopicList';
import { PlayableTextInput } from '../common/components/playable-text';
import QrDialog from './qr-dialog';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => (
  <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
    <SaveButton
      label="Save"
      redirect="list"
      submitOnEnter
      disabled={props.pristine || (props.permissions && !props.permissions.allowEdit)}
    />
    <ShowQuestions size="medium" ml={1} />
    {props.record.globalTopic ? null : <QrDialog ml={1} />}
    <DeleteButton
      basePath={props.basePath}
      record={props.record}
      undoable={false}
      disabled={props.permissions && !props.permissions.allowDelete}
    />
  </Toolbar>
);

export const Advanced = (props) => (
  <>
    <Typography>
      Advanced
    </Typography>
    <TextInput source="topicKey" record={props.record} fullWidth />
  </>
);

const TopicEdit = ({ languages, dispatch, ...props }) => {
  const { permissions } = usePermissions();

  const getLang = (r) => {
    if (!r || !languages[r.fk_languageId]) {
      return null;
    }

    return languages[r.fk_languageId].code;
  };

  return (
    <Edit {...props} title={<TopicTitle />} actions={<CustomTopToolbar />}>
      <SimpleForm toolbar={<CustomToolbar permissions={permissions} />}>
        <PlayableTextInput
          source="name"
          validate={required()}
          fullWidth
          lang={getLang}
        />
        <PlayableTextInput
          source="welcomeText"
          fullWidth
          rows="4"
          multiline
          lang={getLang}
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
        <TextInput source="topicImageUrl" fullWidth />
        <Img />
        <Advanced source="topicKey" />
      </SimpleForm>
    </Edit>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : [];

  return {
    languages,
  };
};

export default connect(mapStateToProps)(TopicEdit);
