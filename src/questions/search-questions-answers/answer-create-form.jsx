import React from 'react';
import { Form } from 'react-final-form'; // eslint-disable-line
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { MarkdownInput } from '../../answers/form';

const CreateForm = ({ onSubmit }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{
      text: '',
    }}
    validate={(values) => {
      const errors = {};

      if (!values.text) {
        errors.text = 'Required';
      }

      return errors;
    }}
    render={({ handleSubmit, valid }) => (
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MarkdownInput
              label="Text"
              source="text"
            />
          </Grid>
          <Grid item xs={12}>
            <Box pt={2}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                fullWidth
                disabled={!valid}
              >
                Create answer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    )}
  />
);

export default CreateForm;
