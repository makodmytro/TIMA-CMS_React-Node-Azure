import React from 'react';
import {
  Confirm,
} from 'react-admin';
import {
  Button,
} from '@material-ui/core';

const ConfirmButton = ({
  onConfirm,
  onCancel,
  component,
  title,
  content,
  buttonText,
  confirmButtonText,
  cancelButtonText,
}) => {
  const [open, setOpen] = React.useState(false);

  const onButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setOpen(true);
  };

  const _onConfirm = () => {
    setOpen(false);

    if (onConfirm) {
      onConfirm();
    }
  };

  const _onClose = () => {
    setOpen(false);

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <>
      <Confirm
        isOpen={open}
        loading={false}
        title={title}
        content={content}
        onConfirm={_onConfirm}
        onClose={_onClose}
        {...{
          ...(confirmButtonText ? { confirm: confirmButtonText } : {}),
          ...(cancelButtonText ? { cancel: cancelButtonText } : {}),
        }}
      />
      {
        !!component && React.cloneElement(component, { onClick: onButtonClick })
      }
      {
        !component && (
          <Button variant="contained" size="small" color="secondary" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )
      }
    </>
  );
};

export default ConfirmButton;
