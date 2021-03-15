import React from 'react';
import Button from '@material-ui/core/Button';
import {
  Confirm,
  useDataProvider,
  useRefresh,
  useNotify,
  usePermissions,
} from 'react-admin';
import TickIcon from '@material-ui/icons/DoneAll';

const BatchApproveButton = ({ answerId, variant }) => {
  const { permissions } = usePermissions();
  const [open, setOpen] = React.useState(false);
  const dataProvider = useDataProvider();
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
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  return (
    <>
      {
        open && (
          <Confirm
            isOpen={open}
            loading={false}
            title="Batch approve"
            content="Are you sure you want to approve this answer's related questions?"
            onConfirm={onConfirm}
            onClose={onClose}
          />
        )
      }
      <Button
        type="button"
        color="secondary"
        onClick={onOpen}
        size="small"
        variant={variant || 'text'}
        disabled={permissions && !permissions.allowEdit}
      >
        <TickIcon /> Approve questions
      </Button>
    </>
  );
};

export default BatchApproveButton;
