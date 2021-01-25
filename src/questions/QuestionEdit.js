import React from 'react';
import {
  Edit,
  SimpleForm,
  useNotify,
  useDataProvider,
  required,
  ReferenceInput,
  SelectInput,
  BooleanInput,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import { PlayableTextInput } from '../common/components/playable-text';
import LinksDialog from './links-dialog';

const LinksButton = ({ onDialogOpen, record }) => (
  <Button
    type="button"
    onClick={() => onDialogOpen(record)}
    variant="outlined"
    color="primary"
    size="small"
  >
    Links
  </Button>
);

const FormFields = ({ languages, record, onDialogOpen }) => {
  const {
    input: { value },
  } = useField('fk_answerId');

  const getLang = () => {
    if (!value || !languages[value]) {
      return null;
    }

    return languages[value].code;
  };

  return (
    <>
      <PlayableTextInput
        label="resources.questions.fields.text"
        source="text"
        validate={required()}
        lang={getLang}
        fullWidth
      />

      <ReferenceInput
        label="resources.questions.fields.fk_topicId"
        source="fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: value }}
      >
        <SelectInput
          optionText="name"
        />
      </ReferenceInput>
      <BooleanInput source="approved" />
      <LinksButton
        record={record}
        onDialogOpen={onDialogOpen}
      />
    </>
  );
};

const QuestionEdit = ({ dispatch, languages, ...props }) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [opened, setOpened] = React.useState(false);
  const [record, setRecord] = React.useState(null);

  const onDialogOpen = (r) => {
    setRecord(r);
    setOpened(true);
  };

  const createAnswer = async (values) => {
    try {
      const { data } = await dataProvider.create('answers', {
        data: values,
      });

      return data;
    } catch (err) {
      notify(`Failed to create new answer for the question: ${err.message}`);

      throw err;
    }
  };

  return (
    <>
      <LinksDialog
        record={record}
        open={opened}
        onClose={() => {
          setOpened(false);
          setRecord(null);
        }}
      />
      <Edit
        {...props}
        actions={<CustomTopToolbar />}
        undoable={false}
        transform={async (data) => {
          const { answer_text: answerText, ...rest } = data;

          if (answerText && !rest.fk_answerId) {
            const answer = await createAnswer({
              text: answerText,
              fk_topicId: rest.fk_topicId,
              fk_languageId: rest.fk_languageId,
            });

            rest.fk_answerId = answer.id;
          }

          return rest;
        }}
      >
        <SimpleForm>
          <FormFields languages={languages} onDialogOpen={onDialogOpen} />
        </SimpleForm>
      </Edit>
    </>
  );
};

const mapStateToProps = (state) => ({
  languages: state.admin.resources.languages.data,
});

export default connect(mapStateToProps)(QuestionEdit);
