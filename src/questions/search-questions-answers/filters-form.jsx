import React from 'react';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  SelectInput,
  TextInput,
  BooleanInput,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const Filters = ({ onSubmit, initialValues }) => {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, values }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={3}>
                <TextInput label="Text" source="q" fullWidth />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <SelectInput
                  label="Search for"
                  source="type"
                  choices={[
                    { id: 'questions', name: 'Questions' },
                    { id: 'answers', name: 'Answers' },
                  ]}
                  fullWidth
                />
              </Grid>
              {
                values.type === 'questions' && (
                  <>
                    <Grid item xs={12} sm={4} md={3}>
                      <SelectInput
                        label="Approved"
                        source="approved"
                        choices={[
                          { id: '__none__', name: 'Both' },
                          { id: true, name: 'Only approved questions' },
                          { id: false, name: 'Only not-approved questions' },
                        ]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <SelectInput
                        label="Ignored"
                        source="ignored"
                        allowEmpty
                        emptyText="Irrelevant"
                        defaultValue={false}
                        choices={[
                          { id: true, name: 'Only ignored' },
                          { id: false, name: 'Only not-ignored' },
                        ]}
                        fullWidth
                      />
                    </Grid>
                  </>
                )
              }
              <Grid item xs={12} sm={4} md={3}>
                <BooleanInput
                  label="All topics"
                  source="all_topics"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <Box pt={2}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                  >
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        );
      }}
    />
  );
};

export default Filters;
