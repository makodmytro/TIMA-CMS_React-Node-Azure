import * as Sentry from '@sentry/react';
import React from 'react';
import {
  Title,
  required,
  useTranslate,
  useDataProvider,
  useNotify,
  useRedirect,
  ReferenceInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  TextInput,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { Form } from 'react-final-form';
import memoize from 'lodash/memoize';
import arrayMutators from 'final-form-arrays'; // eslint-disable-line
import { useSelector } from 'react-redux';
import ApprovedInput from './components/ApprovedInput';
import TopicSelect from '../topics/components/TopicSelect';
import MarkdownInput from './components/MarkdownInput';
import TagsInput from './components/tags-input';
import { useIsAdmin } from '../hooks';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const AnswerCreate = () => {
  const admin = useIsAdmin();
  const translate = useTranslate();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();
  const _languages = useSelector((s) => s.custom.languages);

  const createQuestion = async (_data) => {
    try {
      await dataProvider.create('questions', {
        data: _data,
      });
    } catch (e) {
      notify(e?.body?.message || 'Unexpected error', 'error');
    }
  };

  const onSubmit = async (values) => {
    const {
      fk_languageId, fk_topicId, text, tags, spokenText, questions,
    } = values;

    try {
      const { data } = await dataProvider.create('answers', {
        data: {
          fk_languageId, fk_topicId, text, tags, spokenText,
        },
      });

      await Promise.all(
        questions.filter((q) => q.text).map((q) => createQuestion({
          fk_languageId, fk_topicId, text: q.text, fk_answerId: data.id,
        })),
      );

      notify('The answer was created successfully');
      redirect(`/answers/${data.id}/edit`);
    } catch (e) {
      notify(e?.body?.message, 'error');
    }
  };

  const questionExists = (fk_languageId, fk_topicId) => memoize(async (value) => {
    if (!fk_languageId || !fk_topicId || !value) {
      return null;
    }

    const { data } = await dataProvider.getList('questions', {
      pagination: { perPage: 1, page: 1 },
      filter: {
        text: value,
        fk_topicId,
        fk_languageId,
      },
    });

    if (data && data.length) {
      if (data[0].text.toLowerCase() === value.toLowerCase()) {
        return translate('resources.questions.duplicated');
      }
    }

    return null;
  });

  return (
    <Box boxShadow={3} p={2} borderRadius={3} mt={2}>
      <Title title={translate('resources.answers.create')} />
      <Form
        onSubmit={onSubmit}
        mutators={{
          ...arrayMutators,
        }}
        initialValues={{
          fk_languageId: _languages && _languages.length === 1 ? _languages[0].id : null,
          fk_topicId: null,
          questions: [{
            text: '',
          }, {
            text: '',
          }, {
            text: '',
          }],
          text: '',
          spokenText: '',
          tags: '',
        }}
        validate={async (values) => {
          const errors = {};

          //for each question, if empty, add validation error
          const some = (values.questions || []).some((q) => q && q.text);

          if (!some) {
            errors['questions.0.text'] = translate('Required');
          }

          return errors;
        }}
        validateOnBlur
        render={({ handleSubmit, submitting, values }) => {
          return (
            <form onSubmit={handleSubmit} autoComplete="off">
              {
                _languages.length > 1 && (
                  <ReferenceInput
                    source="fk_languageId"
                    label="resources.answers.fields.fk_languageId"
                    reference="languages"
                    validate={required()}
                    fullWidth
                  >
                    <SelectInput
                      optionText="name"
                    />
                  </ReferenceInput>
                )
              }
              <Box pt={2}>
                <TopicSelect
                  source="fk_topicId"
                  isRequired
                  label="resources.answers.fields.fk_topicId"
                  filterFunction={(t) => t.allowCreateContent}
                />
              </Box>

              <Box pb={2} mb={2} borderBottom="1px dashed #D5D5D5">
                <ArrayInput source="questions" label="misc.questions">
                  <SimpleFormIterator disableRemove={(values.questions.length === 3)}>
                    <TextInput
                      label="resources.questions.fields.text"
                      source="text"
                      fullWidth
                      validate={[required(), questionExists(values.fk_languageId, values.fk_topicId)]}
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </Box>

              <MarkdownInput
                label="resources.answers.fields.text"
                source="text"
              />
              {
                !USE_WORKFLOW && (
                  <ApprovedInput source="approved" label="resources.answers.fields.approved" />
                )
              }
              {
                admin && (
                  <TagsInput source="tags" label="resources.answers.fields.tags" />
                )
              }
              <Button variant="contained" color="primary" type="submit" disabled={submitting}>
                {translate('misc.create')}
              </Button>
            </form>
          );
        }}
      />
    </Box>
  );
};

export default AnswerCreate;
