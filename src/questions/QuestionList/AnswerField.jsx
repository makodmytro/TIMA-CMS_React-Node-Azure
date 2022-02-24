import React from 'react';
import { Link } from 'react-router-dom'; // eslint-disable-line
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Text } from '../../answers/AnswerList';

const AnswerField = ({ record }) => {
  if (!record) {
    return null;
  }

  if (!record.fk_answerId) {
    return (
      <Button
        component={Link}
        to={`/questions/${record.id}`}
        size="small"
        style={{ color: 'red', borderColor: '#ff0000a6' }}
        variant="outlined"
        onClick={(e) => e.stopPropagation()}
      >
        <AddIcon />
        &nbsp;Link answer
      </Button>
    );
  }

  const link = (
    <Button
      component={Link}
      to={`/answers/${record.fk_answerId}`}
      size="small"
      color="primary"
      onClick={(e) => e.stopPropagation()}
    >
      {
        !record.Answer && (
          <>
            View related answer
          </>
        )
      }
    </Button>
  );

  if (!record.Answer) {
    return link;
  }

  return (
    <Text
      record={{
        ...record.Answer,
        Language: record.Language,
        relatedQuestions: record.relatedQuestionsForAnswerCount || 0,
      }}
    />
  );
};

export default AnswerField;
