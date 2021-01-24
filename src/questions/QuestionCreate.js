import React from 'react';
import {
  Create,
  SimpleForm,
  useNotify,
  useDataProvider,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';

const FormFields = ({ open, setOpen }) => {
  const notify = useNotify();
  const {
    input: { onChange },
  } = useField('fk_answerId');

  const onAnswerCreated = (data) => {
    if (data.id) {
      notify(`Answer created with id: ${data.id}`);
      onChange(data.id);
    }

    setOpen(false);
  };

  return (
    <Form open={open} setOpen={setOpen} onAnswerCreated={onAnswerCreated} />
  );
};

const QuestionCreate = (props) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [open, setOpen] = React.useState(false);

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
      <Create
        {...props}
        actions={<CustomTopToolbar />}
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
        <SimpleForm redirect="list">
          <FormFields open={open} setOpen={setOpen} />
        </SimpleForm>
      </Create>
    </>
  );
};

export default QuestionCreate;
