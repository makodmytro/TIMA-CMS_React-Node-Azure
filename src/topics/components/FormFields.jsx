import Typography from '@material-ui/core/Typography';
import React, { useMemo, useState } from 'react';
import { ReferenceInput, SelectInput, TextInput, required, useDataProvider, useTranslate } from 'react-admin';
import { useField } from 'react-final-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { PlayableTextInput } from '../../common/components/playable-text';
import { useIsAdmin } from '../../hooks';
import TopicImage from './Image';
import TopicSelect from './TopicSelect';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_TOPICS ? process.env.REACT_APP_HIDE_FIELDS_TOPICS.split(',') : [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

export const Advanced = (props) => {
  const translate = useTranslate();

  return (
    <>
      <Typography>{translate('misc.advanced')}</Typography>
      <TextInput source="topicKey" record={props.record} fullWidth disabled={props.disabled === true} label="resources.topics.fields.topicKey" />
    </>
  );
};

export const Qna = (props) => {
  const translate = useTranslate();
  const TOPICS_METADATA = process.env.REACT_APP_TOPICS_METADATA_REQUIRED === '1';
  const TOPICS_METADATA_KEYS = process.env.REACT_APP_TOPICS_METADATA_KEYS ? process.env.REACT_APP_TOPICS_METADATA_KEYS.split(',') : ['', '', ''];
  const existedKey = !TOPICS_METADATA_KEYS.includes(props?.record?.qnaMetadataKey);

  const topics = useSelector((state) => state.admin.resources.topics.data);
  const [qnaSourceType, setQnaSourceType] = useState(props?.record?.qnaSourceType || 0);

  const { search } = useLocation();

  const qnaMetadataKeyChoices = useMemo(() => {
    const choices = TOPICS_METADATA_KEYS.map((key) => ({
      id: key,
      name: translate(`resources.topics.fields.qnaMetadataKeyOptions.${key}`) || key,
    }));

    if (!search) {
      return choices;
    }

    const querystring = new URLSearchParams(search);
    const fk_parentTopicId = parseInt(querystring.get('fk_parentTopicId'), 10);

    if (!fk_parentTopicId) {
      return choices;
    }
    const parentMetadataKey = topics[fk_parentTopicId]?.qnaMetadataKey;
    const parentMetadataKeyIndex = TOPICS_METADATA_KEYS.indexOf(parentMetadataKey);

    if (parentMetadataKeyIndex !== -1 && TOPICS_METADATA_KEYS[parentMetadataKeyIndex + 1]) {
      return [choices[parentMetadataKeyIndex + 1]];
    }

    return choices;
  }, [search, topics]);

  return (
    <>
      <Typography>{translate('misc.qna')}</Typography>
      {TOPICS_METADATA_KEYS ? (
        <SelectInput
          source="qnaMetadataKey"
          label="resources.topics.fields.qnaMetadataKey"
          validate={TOPICS_METADATA && required()}
          choices={[...qnaMetadataKeyChoices, existedKey && { id: props?.record?.qnaMetadataKey, name: props?.record?.qnaMetadataKey }]}
          margin="dense"
          initialValue={qnaMetadataKeyChoices.length === 1 ? qnaMetadataKeyChoices[0].id : null}
          fullWidth
        />
      ) : (
        <TextInput
          source="qnaMetadataKey"
          label="resources.topics.fields.qnaMetadataKey"
          validate={TOPICS_METADATA && required()}
          record={props.record}
          fullWidth
          disabled={props.disabled === true}
        />
      )}
      <TextInput
        source="qnaMetadataValue"
        label="resources.topics.fields.qnaMetadataValue"
        validate={TOPICS_METADATA && required()}
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      {!props?.fkParentTopicId && (
        <>
          <SelectInput
            source="qnaSourceType"
            label="resources.topics.fields.qnaSourceType"
            validate={required()}
            choices={[
              { id: 1, name: 'Language Studio' },
              { id: 0, name: 'QnaMaker' },
            ]}
            margin="dense"
            initialValue={1}
            fullWidth
            onChange={(e) => setQnaSourceType(e.target.value)}
          />
          <TextInput
            source="qnaApiEndpoint"
            label="resources.topics.fields.qnaApiEndpoint"
            record={props.record}
            fullWidth
            disabled={props.disabled === true}
          />
          {qnaSourceType === 1 ? (
            <TextInput
              source="qnaLangStudioApiVersion"
              label="resources.topics.fields.qnaLangStudioApiVersion"
              record={props.record}
              validate={required()}
              fullWidth
              initialValue="2021-10-01"
              disabled={props.disabled === true}
            />
          ) : (
            <TextInput
              source="qnaApiVersion"
              label="resources.topics.fields.qnaApiVersion"
              validate={required()}
              record={props.record}
              fullWidth
              disabled={props.disabled === true}
            />
          )}
          <TextInput
            source="qnaSubscriptionKey"
            label="resources.topics.fields.qnaSubscriptionKey"
            record={props.record}
            fullWidth
            disabled={props.disabled === true}
            type={props.disabled ? 'password' : 'text'}
          />
          {qnaSourceType === 1 ? (
            <TextInput
              source="qnaProjectName"
              label="resources.topics.fields.qnaProjectName"
              record={props.record}
              validate={required()}
              fullWidth
              disabled={props.disabled === true}
            />
          ) : (
            <TextInput
              source="qnaKnowledgeBaseId"
              label="resources.topics.fields.qnaKnowledgeBaseId"
              validate={required()}
              record={props.record}
              fullWidth
              disabled={props.disabled === true}
            />
          )}
        </>
      )}
    </>
  );
};

const FormFields = (props) => {
  const _languages = useSelector((state) => state.custom.languages);
  const dataProvider = useDataProvider();
  const { search } = useLocation();
  const querystring = new URLSearchParams(search);

  const disabled = props?.record?.allowEdit === false || props?.record?.allowManage === false;
  const admin = useIsAdmin();

  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const {
    input: { value: fkParentTopicId, onChange: onFkParentTopicIdChange },
  } = useField('fk_parentTopicId');
  const {
    input: { onChange: qnaApiEndpointChange },
  } = useField('qnaApiEndpoint');
  const {
    input: { onChange: qnaApiVersionChange },
  } = useField('qnaApiVersion');
  const {
    input: { onChange: qnaSubscriptionKeyChange },
  } = useField('qnaSubscriptionKey');
  const {
    input: { onChange: qnaKnowledgeBaseIdChange },
  } = useField('qnaKnowledgeBaseId');
  const {
    input: { value: qnaMetadataValue, onChange: qnaMetadataValueChange },
  } = useField('qnaMetadataValue');
  const {
    input: { onChange: qnaProjectNameValueChange },
  } = useField('qnaProjectName');
  const {
    input: { onChange: qnaLangStudioApiVersionValueChange },
  } = useField('qnaLangStudioApiVersion');
  const {
    input: { value: nameValue },
  } = useField('name');

  const getLang = (r) => {
    if (!r || !r.fk_languageId || !props.languages[r.fk_languageId]) {
      return null;
    }

    return props.languages[r.fk_languageId].code;
  };

  const onParentSelected = async () => {
    if (!fkParentTopicId) {
      return;
    }

    try {
      const { data } = await dataProvider.getOne('topics', {
        id: fkParentTopicId,
      });

      if (data) {
        qnaApiEndpointChange(data.qnaApiEndpoint);
        qnaApiVersionChange(data.qnaApiVersion);
        qnaSubscriptionKeyChange(data.qnaSubscriptionKey);
        qnaKnowledgeBaseIdChange(data.qnaKnowledgeBaseId);
        qnaProjectNameValueChange(data.qnaProjectName);
        qnaLangStudioApiVersionValueChange(data.qnaLangStudioApiVersion);
      }
    } catch (e) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (_languages.length && !fkLanguageId) {
      changeLanguage(_languages[0].id);
    }
  }, [_languages, fkLanguageId]);

  React.useEffect(() => {
    const valueFromUrl = querystring.get('fk_parentTopicId') ? parseInt(querystring.get('fk_parentTopicId'), 10) : null;
    //check if value from url is valid numeric and different from the one in the form
    if (!fkParentTopicId || (valueFromUrl > 0 && valueFromUrl !== fkParentTopicId)) {
      onFkParentTopicIdChange(valueFromUrl);
    }
  }, [fkParentTopicId]);

  React.useEffect(() => {
    onParentSelected();
  }, [fkParentTopicId]);

  React.useEffect(() => {
    if (qnaMetadataValue === '' && !props.editing) {
      qnaMetadataValueChange(nameValue.toLocaleLowerCase());
    }
  }, [nameValue]);

  return (
    <>
      <HiddenField fieldName="name">
        <PlayableTextInput
          source="name"
          validate={required()}
          fullWidth
          lang={getLang}
          disabled={disabled && !admin}
          record={props?.record}
          label="resources.topics.fields.name"
        />
      </HiddenField>
      <HiddenField fieldName="welcomeText">
        <PlayableTextInput
          source="welcomeText"
          fullWidth
          rows="4"
          multiline
          lang={getLang}
          disabled={disabled && !admin}
          record={props?.record}
          label="resources.topics.fields.welcomeText"
        />
      </HiddenField>
      {_languages && _languages.length > 1 && (
        <HiddenField fieldName="fk_languageId">
          <ReferenceInput
            validate={required()}
            source="fk_languageId"
            reference="languages"
            label="resources.topics.fields.language"
            fullWidth
            disabled={disabled && !admin}
          >
            <SelectInput optionText="name" />
          </ReferenceInput>
        </HiddenField>
      )}
      <HiddenField fieldName="topicImageUrl">
        <TextInput source="topicImageUrl" fullWidth disabled={disabled && !admin} label="resources.topics.fields.image" />
      </HiddenField>
      <HiddenField fieldName="topicImageUrl">
        <TopicImage {...props} />
      </HiddenField>
      {(!props?.editting || fkParentTopicId) && (
        <HiddenField fieldName="fk_parentTopicId">
          <TopicSelect
            source="fk_parentTopicId"
            disabled
            label="resources.topics.fields.fk_parentTopicId"
            allowEmpty
            depth={2}
            editting
            anyLevelSelectable
            isRequired
            filterFunction={(topic) => topic?.allowCreateChild}
          />
        </HiddenField>
      )}

      {/*
          <HiddenField fieldName="level">
            <TextInput source="level" label="resources.topics.fields.level" fullWidth disabled />
          </HiddenField>
        */}

      <HiddenField fieldName="topicKey">
        <Advanced source="topicKey" disabled={disabled && !admin} />
      </HiddenField>
      {(!fkParentTopicId || admin) && (
        <HiddenField fieldName="qna">
          <Qna {...props} disabled={disabled && !admin} fkParentTopicId={fkParentTopicId} />
        </HiddenField>
      )}
    </>
  );
};

export default FormFields;
