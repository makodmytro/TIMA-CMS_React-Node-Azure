import React from 'react';
import Button from '@material-ui/core/Button';
import { Confirm, useDataProvider, useRefresh, useNotify, useTranslate } from 'react-admin';
import TickIcon from '@material-ui/icons/DoneAll';

const BatchApproveButton = ({ answerId, variant, disabled }) => {
  const [open, setOpen] = React.useState(false);
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const notify = useNotify();
  const refresh = useRefresh();

  const onOpen = (e) => {
    e.stopPropagation();

    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onConfirm = async () => {
    try {
      await dataProvider.batchApproveQuestions(null, {
        id: answerId,
      });

      notify('The related questions were approved');
      refresh();
    } catch (err) {
      notify(err?.body?.code || err?.body?.message || 'We could not execute the action', 'error');
    }
  };

  return (
    <>
      {open && (
        <Confirm
          isOpen={open}
          loading={false}
          title={translate('misc.batch_approve')}
          content={translate('dialogs.batch_approve')}
          onConfirm={onConfirm}
          onClose={onClose}
        />
      )}
      <Button type="button" color="secondary" onClick={onOpen} size="small" variant={variant || 'text'} disabled={disabled === true}>
        <TickIcon /> {translate('misc.batch_approve')}
      </Button>
    </>
  );
};

export default BatchApproveButton;
