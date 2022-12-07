import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  BooleanInput,
  Confirm,
  useTranslate,
} from 'react-admin';
import Box from '@material-ui/core/Box';
import { Alert } from '@material-ui/lab';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import TagsInput from './tags-input';
import MarkdownInput from './MarkdownInput';
import TopicSelect from '../../topics/components/TopicSelect';
import { useDisabledCreate, useIsAdmin } from '../../hooks';
import ApprovedInput from './ApprovedInput';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const Form = ({
  languages, topics, edit, record,
}) => {
  const _languages = useSelector((state) => state.custom.languages);
  const admin = useIsAdmin();

  const translate = useTranslate();
  const [tmpLanguageValue, setTmpLanguageValue] = React.useState(null);
  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { value: fkTopicId, onChange: changeTopic },
  } = useField('fk_topicId');
  const disableEditRule = edit ? false : useDisabledCreate();
  const disableEditProp = (record && record.allowEdit === false);
  const disableEdit = disableEditRule || disableEditProp;
  const followupParentQuestions = record && record.RelatedQuestions.map((question) => question.parentAnswers && question.parentAnswers.length);
  const getLang = () => {
    if (!fkLanguageId || !languages[fkLanguageId]) {
      return null;
    }

    return languages[fkLanguageId].code;
  };

  const onLanguageChangeConfirm = () => {
    changeLanguage(tmpLanguageValue);

    const current = topics[fkTopicId];
    let first = Object.values(topics).find((t) => {
      return t.fk_languageId === tmpLanguageValue && t.topicKey === current.topicKey;
    });

    if (!first) {
      first = Object.values(topics).find((t) => t.fk_languageId === tmpLanguageValue);
    }

    if (first) {
      changeTopic(first.id);
    }

    setTmpLanguageValue(null);
  };

  const onLanguageChangeCancel = () => {
    setTmpLanguageValue(null);
    changeLanguage(record.fk_languageId);
  };

  const inputProps = !edit
    ? {}
    : {
      onChange: (e) => {
        e.preventDefault();
        e.stopPropagation();

        setTmpLanguageValue(e.target.value);
      },
    };

  React.useEffect(() => {
    if (_languages.length && !fkLanguageId) {
      changeLanguage(_languages[0].id);
    }
  }, [_languages, fkLanguageId]);

  return (
    <>
      {
        edit && (
          <Confirm
            isOpen={!!tmpLanguageValue}
            loading={false}
            title={translate('misc.change_language')}
            content={translate('dialogs.change_language')}
            onConfirm={onLanguageChangeConfirm}
            onClose={onLanguageChangeCancel}
            confirm="Proceed"
            cancel="Undo change"
          />
        )
      }
      <MarkdownInput
        label="resources.answers.fields.text"
        source="text"
        lang={getLang()}
        disabled={disableEdit}
      />

      {_languages.length > 1 && (
        <ReferenceInput
          source="fk_languageId"
          label="resources.answers.fields.fk_languageId"
          reference="languages"
          validate={required()}
          fullWidth
          inputProps={inputProps}
          disabled={disableEdit}
        >
          <SelectInput
            optionText="name"
            disabled={disableEdit}
          />
        </ReferenceInput>
      )}
      <Box pt={2}>
        {
          fkLanguageId && (
            <TopicSelect
              source="fk_topicId"
              isRequired
              label="resources.answers.fields.fk_topicId"
              editting={edit}
              record={record}
              disabled={disableEdit}
              filterFunction={(t) => {
                return t.allowCreateContent && t.fk_languageId === fkLanguageId;
              }}
            />
          )
        }
      </Box>
      <BooleanInput
        source="isContextOnly"
        label="resources.answers.fields.isContextOnly"
        disabled={disableEdit || (record && !record.isFollowupChild)}
      />
      {followupParentQuestions > 1 && <Alert severity="info">{translate('resources.users.workflow.errors.MAX_1_PARENT_FOR_CONTEXT_ONLY')}</Alert>}
      {
        !USE_WORKFLOW && (
          <ApprovedInput source="approved" label="resources.answers.fields.approved" disabled={disableEdit} />
        )
      }
      {
        admin && (
          <TagsInput source="tags" label="resources.answers.fields.tags" disabled={disableEdit} />
        )
      }
    </>
  );
};

const mapStateToProps = (state) => {
  const languages = state.admin.resources.languages
    ? state.admin.resources.languages.data
    : {};

  const topics = state.admin.resources.topics
    ? state.admin.resources.topics.data
    : {};

  return {
    languages,
    topics,
  };
};

export default connect(mapStateToProps)(Form);
