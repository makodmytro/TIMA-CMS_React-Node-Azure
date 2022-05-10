import React from 'react';
import {
  Edit,
  SimpleForm,
  Toolbar,
  SaveButton,
  DeleteButton,
} from 'react-admin';
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import QrDialog from './components/qr-dialog';
import FormFields from './components/FormFields';
import ShowQuestions from './components/ShowQuestionsButton';
import { useIsAdmin } from '../hooks';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => {
  const disableEdit = props?.record?.allowEdit === false;
  const disableDelete = props?.record?.allowDelete === false;
  const admin = useIsAdmin();

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine || (disableEdit && !admin)}
      />
      <ShowQuestions size="medium" ml={1} />
      {props.record.globalTopic ? null : <QrDialog ml={1} />}
      <DeleteButton
        basePath={props.basePath}
        record={props.record}
        undoable={false}
        disabled={disableDelete && !admin}
      />
    </Toolbar>
  );
};

const TopicEdit = ({ languages, dispatch, ...props }) => {
  return (
    <Edit {...props} title={<TopicTitle />} actions={<CustomTopToolbar />} undoable={false}>
      <SimpleForm toolbar={<CustomToolbar />} warnWhenUnsavedChanges>
        <FormFields {...props} languages={languages} editting />
      </SimpleForm>
    </Edit>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  return {
    languages,
  };
};

export default connect(mapStateToProps)(TopicEdit);
