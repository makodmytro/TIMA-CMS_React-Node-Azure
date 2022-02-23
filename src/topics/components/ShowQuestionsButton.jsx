import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const ShowQuestions = ({
  record, size, fullWidth, ml,
}) => {
  if (!record) {
    return null;
  }

  return (
    <Box ml={ml}>
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
        Show questions
      </Button>
    </Box>
  );
};

export default ShowQuestions;
