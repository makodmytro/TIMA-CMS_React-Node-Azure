import React from 'react';
import {
  useTranslate,
  Confirm,
  useNotify,
  useDataProvider,
} from 'react-admin';
import {
  Box,
} from '@material-ui/core';
import Table from './Table';
import useAnswer from '../../useAnswer';

const List = ({ record }) => {
  const translate = useTranslate();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { refresh } = useAnswer();
  const [confirmations, setConfirmations] = React.useState({
    id: null,
    unlink: false,
  });

  const top = () => window.scrollTo(0, 0);

  const onUnlinkClick = (id) => {
    setConfirmations({
      ...confirmations,
      unlink: true,
      id,
    });
  };

  const unlinkAnswerClosed = () => {
    setConfirmations({
      ...confirmations,
      unlink: false,
      id: null,
    });
  };

  const unlinkAnswerConfirmed = async () => {
    await dataProvider.delete('questions', {
      id: confirmations.id,
    });

    notify('Deleted successfully');
    unlinkAnswerClosed();
    refresh();
    top();
  };

  return (
    <>
      <Confirm
        isOpen={confirmations.unlink}
        loading={false}
        title={translate('misc.unlink_answer')}
        content={translate('dialogs.unlink_confirmation')}
        onConfirm={unlinkAnswerConfirmed}
        onClose={unlinkAnswerClosed}
      />
      <Box p={2} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Table record={record} onUnlinkClick={onUnlinkClick} />
      </Box>
    </>
  );
};

export default List;
