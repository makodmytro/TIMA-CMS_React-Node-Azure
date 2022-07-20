import React from 'react';
import {
  Edit,
  SimpleForm,
  Toolbar,
  SaveButton,
} from 'react-admin';
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import QrDialog from './components/qr-dialog';
import FormFields from './components/FormFields';
import ShowQuestions from './components/ShowAnswersButton';
import DeleteDialog from './components/DeleteDialog';
import { useIsAdmin } from '../hooks';

const HIDE_SHOW_QR = process.env.REACT_APP_HIDE_TOPICS_SHOW_QR === '1';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => {
  const admin = useIsAdmin();
  const disableEdit = props?.record?.allowEdit === false;
  const disableDelete = props?.record?.allowDelete !== true && !admin;

  return (
    <Toolbar {...props} style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SaveButton
        label="ra.action.save"
        redirect="list"
        submitOnEnter
        disabled={props.pristine || (disableEdit && !admin)}
      />
      <ShowQuestions size="medium" ml={1} record={props?.record} />
      {props.record.globalTopic || HIDE_SHOW_QR ? null : <QrDialog ml={1} />}
      {
        !(disableDelete || !admin) && (
          <DeleteDialog />
        )
      }
    </Toolbar>
  );
};

const TopicEdit = ({ languages, dispatch, ...props }) => {
  return (
    <>
      <Edit {...props} title={<TopicTitle />} actions={<CustomTopToolbar to="/topics" />} undoable={false}>
        <SimpleForm toolbar={<CustomToolbar />}>
          <FormFields {...props} languages={languages} editting />
        </SimpleForm>
      </Edit>
    </>
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
