import React from 'react';
import {
  ReferenceInput,
  required,
  SelectInput,
  TextInput,
  useTranslate,
  useDataProvider,
} from 'react-admin';
import { useLocation } from 'react-router-dom';
import { useField } from 'react-final-form';
import { useSelector } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import TopicSelect from './TopicSelect';
import { PlayableTextInput } from '../../common/components/playable-text';
import { useIsAdmin } from '../../hooks';

const HIDE_FIELDS_TOPICS = process.env.REACT_APP_HIDE_FIELDS_TOPICS ? process.env.REACT_APP_HIDE_FIELDS_TOPICS.split(',') : [];

const HiddenField = ({ children, fieldName }) => {
  if (HIDE_FIELDS_TOPICS.includes(fieldName)) {
    return null;
  }

  return children;
};

export const Qna = (props) => {
  const translate = useTranslate();

  return (
    <>
      <Typography>
        {translate('misc.qna')}
      </Typography>
      <TextInput
        source="qnaMetadataKey"
        label="resources.topics.fields.qnaMetadataKey"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
      <TextInput
        source="qnaMetadataValue"
        label="resources.topics.fields.qnaMetadataValue"
        record={props.record}
        fullWidth
        disabled={props.disabled === true}
      />
    </>
  );
};

const FormFields = (props) => {
  const _languages = useSelector((state) => state.custom.languages);
  const dataProvider = useDataProvider();
  const { search } = useLocation();
  const querystring = new URLSearchParams(search);

  const admin = useIsAdmin();

  const {
    input: { value: fkLanguageId, onChange: changeLanguage },
  } = useField('fk_languageId');
  const { input: { value: fkParentTopicId, onChange: onFkParentTopicIdChange } } = useField('fk_parentTopicId');
  const { input: { onChange: qnaApiEndpointChange } } = useField('qnaApiEndpoint');
  const { input: { onChange: qnaApiVersionChange } } = useField('qnaApiVersion');
  const { input: { onChange: qnaSubscriptionKeyChange } } = useField('qnaSubscriptionKey');
  const { input: { onChange: qnaKnowledgeBaseIdChange } } = useField('qnaKnowledgeBaseId');

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
      }
    } catch (e) {} // eslint-disable-line
  };

  React.useEffect(() => {
    if (_languages.length && !fkLanguageId) {
      changeLanguage(_languages[0].id);
    }
  }, [_languages, fkLanguageId]);

  React.useEffect(() => {
    if (!fkParentTopicId && querystring.get('fk_parentTopicId') && parseInt(querystring.get('fk_parentTopicId'), 10)) {
      onFkParentTopicIdChange(parseInt(querystring.get('fk_parentTopicId'), 10));
    }
  }, [fkParentTopicId]);

  React.useEffect(() => {
    onParentSelected();
  }, [fkParentTopicId]);

  return (
    <>
      <HiddenField fieldName="name">
        <PlayableTextInput
          source="name"
          validate={required()}
          fullWidth
          lang={getLang}
          record={props?.record}
          label="resources.topics.fields.name"
        />
      </HiddenField>
      {
        _languages && _languages.length > 1 && (
          <HiddenField fieldName="fk_languageId">
            <ReferenceInput
              validate={required()}
              source="fk_languageId"
              reference="languages"
              label="resources.topics.fields.language"
              fullWidth
            >
              <SelectInput
                optionText="name"
              />
            </ReferenceInput>
          </HiddenField>
        )
      }
      <HiddenField fieldName="fk_parentTopicId">
        <TopicSelect
          source="fk_parentTopicId"
          disabled={props?.disableTopicSelection}
          label="resources.topics.fields.fk_parentTopicId"
          allowEmpty
          depth={2}
          editting={props?.editting}
          anyLevelSelectable
          isRequired={!admin}
          filterFunction={(topic) => topic?.allowCreateChild}
        />
      </HiddenField>
      <HiddenField fieldName="qna">
        <Qna {...props} />
      </HiddenField>
    </>
  );
};

export default FormFields;
