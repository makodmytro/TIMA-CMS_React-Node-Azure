import React from 'react';
import {
  Edit,
  SimpleForm,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  useTranslate,
  useDataProvider,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import QrDialog from './components/qr-dialog';
import FormFields from './components/FormFields';
import ShowQuestions from './components/ShowQuestionsButton';
import DeleteDialog from '../common/components/DeleteDialog';
import { useIsAdmin } from '../hooks';

const TopicTitle = ({ record }) => (record ? <span>{record.name}</span> : null);
const CustomToolbar = (props) => {
  const [open, setOpen] = React.useState(false);
  const translate = useTranslate();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();
  const disableEdit = props?.record?.allowEdit === false;
  const disableDelete = props?.record?.allowDelete !== true;
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
      <>
        <Button
          className="error-btn"
          variant="outlined"
          disabled={disableDelete || !admin}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setOpen(true);
          }}
        >
          {translate('resources.topics.delete')}
        </Button>
      </>
      <DeleteDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          setOpen(false);
          dataProvider.delete('topics', { id: props?.record?.id }).then(() => {
            notify('Deleted successfully');
            redirect('/topics');
          });
        }}
        title={`${translate('resources.topics.delete')}?`}
        confirmationText={translate('resources.topics.delete')}
        content={(
          <Box px={10} mt={2}>
            <Typography align="center" variant="body2">
              {translate('misc.you_will_lose')}:
            </Typography>
            <Box display="flex" justifyContent="center" mt={2}>
              <Box>
                <Typography variant="body2">- {translate('resources.topics.delete_cascade_one')}</Typography>
                <Typography variant="body2">- {translate('resources.topics.delete_cascade_two')}</Typography>
                <Typography variant="body2">- {translate('resources.topics.delete_cascade_three')}</Typography>
              </Box>
            </Box>
          </Box>
        )}
      />
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
