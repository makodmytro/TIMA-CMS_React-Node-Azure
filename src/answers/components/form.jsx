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
import { connect, useSelector } from 'react-redux';
import TagsInput from './tags-input';
import MarkdownInput from './MarkdownInput';
import TopicSelect from '../../topics/components/TopicSelect';
import { useDisabledCreate } from '../../hooks';

const USE_WORKFLOW = process.env.REACT_APP_USE_WORKFLOW === '1';

const Approved = (props) => {
  const { permissions } = usePermissions();

  const { input: { onChange: changeApprovedAt } } = useField('approvedAt');
  const { input: { onChange: changeApprovedBy } } = useField('approvedBy_editorId');

  const afterChange = (checked) => {
    if (checked) {
      changeApprovedAt((new Date()).toISOString());
      changeApprovedBy(permissions?.editorId);
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
  const _languages = useSelector((state) => state.custom.languages);

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
      <TopicSelect
        source="fk_topicId"
        isRequired
        label="resources.answers.fields.fk_topicId"
        editting={edit}
        disabled={disableEdit}
        filter={{ fk_languageId: fkLanguageId }}
      />
      {
        !USE_WORKFLOW && (
          <Approved source="approved" label="resources.answers.fields.approved" disabled={disableEdit} />
        )
      }
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
