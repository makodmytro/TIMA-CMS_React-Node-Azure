import React from 'react';
import { useTranslate } from 'react-admin';
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
  const translate = useTranslate();
  const {
    input: { onChange: onValueChange, value },
  } = useField(source);

  return (
    <FormGroup>
      <DateTimePicker
        label={translate(label)}
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
      <p style={{ marginTop: '8px' }} className="MuiFormHelperText-root MuiFormHelperText-contained MuiFormHelperText-marginDense" />
    </FormGroup>
  );
};

export const DateInput = ({
  label,
  source,
  onChange,
  ...rest
}) => {
  const translate = useTranslate();
  const {
    input: { onChange: onValueChange, value },
  } = useField(source);

  return (
    <FormGroup>
      <DatePicker
        label={translate(label)}
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
