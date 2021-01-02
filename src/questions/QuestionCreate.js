import React from 'react';
import {
  Create,
  SimpleForm,
  useNotify,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import Button from '@material-ui/core/Button';
import CustomTopToolbar from '../common/components/custom-top-toolbar';
import Form from './form';

const Toolbar = ({ onClick }) => (
  <CustomTopToolbar>
    <Button
      type="button"
      onClick={onClick}
      color="primary"
      variant="outlined"
    >
      Create and insert answer
    </Button>
  </CustomTopToolbar>
);

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
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Create {...props} actions={<Toolbar onClick={() => setOpen(true)} />}>
        <SimpleForm>
          <FormFields open={open} setOpen={setOpen} />
        </SimpleForm>
      </Create>
    </>
  );
};

export default QuestionCreate;
