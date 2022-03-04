import React from 'react';
import { useTranslate } from 'react-admin';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const ShowQuestions = ({
  record, size, fullWidth, ml,
}) => {
  const translate = useTranslate();

  if (!record) {
    return null;
  }

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
        to={`/questions?filter=${encodeURIComponent(JSON.stringify({ fk_topicId: record.id }))}`}
        fullWidth={!!fullWidth}
      >
        {translate('misc.show_questions')}
      </Button>
    </Box>
  );
};

export default ShowQuestions;
