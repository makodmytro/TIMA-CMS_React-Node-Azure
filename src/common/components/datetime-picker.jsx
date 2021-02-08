import React from 'react';
import { useField } from 'react-final-form'; // eslint-disable-line
import { DateTimePicker, DatePicker } from '@material-ui/pickers';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormGroup from '@material-ui/core/FormGroup';

export const DateTimeInput = ({
  label,
  source,
  onChange,
  ...rest
}) => {
  const {
    input: { onChange: onValueChange, value },
    meta: { touched, error },
  } = useField(source);

  return (
    <FormGroup>
      <DateTimePicker
        label={label}
        value={value || null}
        format="yyyy-MM-dd HH:mm"
        onChange={(e) => {
          onValueChange(e);

          if (onChange) {
            onChange(e);
          }
        }}
        autoOk
        ampm={false}
        margin="dense"
        clearable
        {...rest}
      />
      <FormHelperText margin="dense">&nbsp;</FormHelperText>
    </FormGroup>
  );
};

export const DateInput = ({
  label,
  source,
  onChange,
  ...rest
}) => {
  const {
    input: { onChange: onValueChange, value },
    meta: { touched, error },
  } = useField(source);

  return (
    <FormGroup>
      <DatePicker
        label={label}
        value={value || null}
        format="yyyy-MM-dd"
        onChange={(e) => {
          onValueChange(e);

          if (onChange) {
            onChange(e);
          }
        }}
        autoOk
        margin="dense"
        clearable
        {...rest}
      />
      <FormHelperText margin="dense">&nbsp;</FormHelperText>
    </FormGroup>
  );
};
