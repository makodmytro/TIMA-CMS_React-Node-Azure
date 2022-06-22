import React from 'react';
import { useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const ShowAnswers = ({
  record, size, fullWidth, ml,
}) => {
  const translate = useTranslate();

  if (!record) {
    return null;
  }

  const ids = (record.ChildTopics || []).reduce((acc, cur) => {
    const grandchildren = (cur.ChildTopics || []).map((gt) => gt.id);

    return acc.concat([cur.id]).concat(grandchildren);
  }, [record.id]);

  return (
    <Box ml={ml} width={fullWidth ? '100%' : 'initial'}>
      <Button
        component={Link}
        onClick={(e) => {
          e.stopPropagation();
        }}
        size={size || 'small'}
        color="primary"
        variant="outlined"
        to={`/answers?filter=${encodeURIComponent(JSON.stringify({ fk_topicId: ids }))}`}
        fullWidth={!!fullWidth}
      >
        {translate('misc.show_answers')}
      </Button>
    </Box>
  );
};

export default ShowAnswers;
