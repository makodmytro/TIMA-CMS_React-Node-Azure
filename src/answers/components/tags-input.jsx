import React from 'react';
import { useTranslate } from 'react-admin';
import { useField } from 'react-final-form';
import ChipInput from 'material-ui-chip-input';

const HIDE_TAGS_INPUT = process.env.REACT_APP_HIDE_TAGS_INPUT === '1';

const TagsInput = (props) => {
  const translate = useTranslate();
  const { input: { value, onChange } } = useField(props.source);

  const asArray = (value || '').split(',').filter((s) => !!s);

  if (HIDE_TAGS_INPUT) {
    return null;
  }

  return (
    <ChipInput
      value={asArray}
      onAdd={(chip) => {
        onChange(asArray.concat([chip]).join(','));
      }}
      onDelete={(chip, index) => {
        const filtered = asArray.filter((v, i) => i !== index);

        onChange(filtered.join(','));
      }}
      newChipKeyCodes={[9, 13, 188]}
      margin="normal"
      blurBehavior="add"
      label={translate(props.label)}
      disabled={props?.disabled === true}
      fullWidth
    />
  );
};

export default TagsInput;
