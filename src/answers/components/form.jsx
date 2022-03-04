import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  Confirm,
  BooleanInput,
  usePermissions,
  useTranslate,
} from 'react-admin';
import { useField } from 'react-final-form'; // eslint-disable-line
import { connect } from 'react-redux';
import TagsInput from './tags-input';
import MarkdownInput from './MarkdownInput';
import { useDisabledEdit, useDisabledCreate } from '../../hooks';

const Approved = (props) => {
  const { permissions } = usePermissions();

  const { input: { onChange: changeApprovedAt } } = useField('approvedAt');
  const { input: { onChange: changeApprovedBy } } = useField('approvedBy_editorId');

  const afterChange = (checked) => {
    if (checked) {
      changeApprovedAt((new Date()).toISOString());
      changeApprovedBy(permissions.editorId);
    } else {
      changeApprovedAt(null);
      changeApprovedBy(null);
    }
  };

  return (
    <BooleanInput
      source={props.source}
      label={props.label}
      onChange={afterChange}
      disabled={props.disabled === true}
    />
  );
};

const Form = ({
  languages, topics, edit, record,
}) => {
  const translate = useTranslate();
  const [tmpLanguageValue, setTmpLanguageValue] = React.useState(null);
  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { value: fkTopicId, onChange: changeTopic },
  } = useField('fk_topicId');
  const disableEdit = edit ? useDisabledEdit(fkTopicId) : useDisabledCreate();

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

      <ReferenceInput
        source="fk_topicId"
        label="resources.answers.fields.fk_topicId"
        reference="topics"
        validate={required()}
        fullWidth
        filter={{ fk_languageId: fkLanguageId }}
        disabled={disableEdit}
      >
        <SelectInput
          optionText="name"
          disabled={disableEdit}
        />
      </ReferenceInput>
      <Approved source="approved" label="resources.answers.fields.approved" disabled={disableEdit} />
      <TagsInput source="tags" label="resources.answers.fields.tags" disabled={disableEdit} />
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
