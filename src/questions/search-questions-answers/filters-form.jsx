import React from 'react';
import { Form } from 'react-final-form'; // eslint-disable-line
import {
  SelectInput,
  TextInput,
  BooleanInput,
  useTranslate,
} from 'react-admin';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const Filters = ({ onSubmit, initialValues }) => {
  const translate = useTranslate();

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
                  label={translate('misc.search_for')}
                  source="type"
                  choices={[
                    { id: 'questions', name: translate('misc.questions') },
                    { id: 'answers', name: translate('misc.answers') },
                  ]}
                  fullWidth
                />
              </Grid>
              {
                values.type === 'questions' && (
                  <>
                    {
                      !USE_WORKFLOW && (
                        <Grid item xs={12} sm={4} md={3}>
                          <SelectInput
                            label="Approved"
                            source="approved"
                            choices={[
                              { id: '__none__', name: translate('misc.both') },
                              { id: true, name: translate('misc.only_approved_questions') },
                              { id: false, name: translate('misc.only_not_approved_questions') },
                            ]}
                            fullWidth
                          />
                        </Grid>
                      )
                    }
                    <Grid item xs={12} sm={4} md={3}>
                      <BooleanInput
                        label="resources.questions.fields.ignored"
                        source="ignored"
                        alwaysOn
                        onChange={() => handleSubmit()}
                      />
                    </Grid>
                  </>
                )
              }
              <Grid item xs={12} sm={4} md={3}>
                <BooleanInput
                  label="resources.questions.fields.all_topics"
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
                    {translate('misc.search')}
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
