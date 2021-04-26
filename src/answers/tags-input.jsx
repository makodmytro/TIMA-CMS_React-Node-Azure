import React from 'react';
import { useField } from 'react-final-form';
import ChipInput from 'material-ui-chip-input';

const TagsInput = (props) => {
  const { input: { value, onChange } } = useField(props.source);

  const asArray = (value || '').split(',').filter((s) => !!s);

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
      label={props.label}
      fullWidth
    />
  );
};

export default TagsInput;
