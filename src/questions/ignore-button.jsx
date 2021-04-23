import React from 'react';
import Button from '@material-ui/core/Button';
import BlockIcon from '@material-ui/icons/RemoveCircleOutline';
import {
  useDataProvider,
  useNotify,
  useRefresh,
} from 'react-admin';

const IgnoreButton = ({
  record, justifyContent, onClick,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const updateIgnored = async (ignored) => {
    try {
      await dataProvider.update('questions', {
        id: record.id,
        data: { ignored },
      });

      notify('The question was updated');
      refresh();
    } catch (err) {
      if (err.body && err.body.message) {
        notify(err.body.message, 'error');
      }
    }
  };

  const handleClick = (e) => {
    updateIgnored(!record.ignored);

    if (onClick) {
      onClick(e);
    }
  };

  if (!record) {
    return null;
  }

  return (
    <Button
      type="button"
      size="small"
      fullWidth
      onClick={handleClick}
      style={{ justifyContent: justifyContent || 'flex-start' }}
    >
      <BlockIcon fontSize="small" />&nbsp;
      {
        record.ignored && (<>Un-ignore</>)
      }
      {
        !record.ignored && (<>Ignore</>)
      }
    </Button>
  );
};

export default IgnoreButton;
