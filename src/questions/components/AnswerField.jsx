import React from 'react';
import { useTranslate, useRedirect } from 'react-admin';
import { Link } from 'react-router-dom'; // eslint-disable-line
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import AnswerTextField from '../../answers/components/TextField';

const AnswerField = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  if (!record) {
    return null;
  }

  if (!record.fk_answerId) {
    return (
      <Button
        component={Link}
        to={`/questions/${record.id}`}
        size="small"
        className="error-btn btn-xs"
        variant="outlined"
        onClick={(e) => e.stopPropagation()}
      >
        <AddIcon />
        &nbsp;{translate('misc.link_answer')}
      </Button>
    );
  }

  const link = (
    <Button
      component={Link}
      to={`/answers/${record.fk_answerId}/edit`}
      size="small"
      color="primary"
      onClick={(e) => e.stopPropagation()}
    >
      {
        !record.Answer && (
          <>
            {translate('misc.view_related_answer')}
          </>
        )
      }
    </Button>
  );

  if (!record.Answer) {
    return link;
  }

  const goToAnswer = (e) => {
    e.stopPropagation();
    e.preventDefault();

    redirect(`/answers/${record.Answer.id}/edit`)
  };

  return (
    <span onClick={goToAnswer}>
      <AnswerTextField
        record={{
          ...record.Answer,
          Language: record.Language,
          relatedQuestions: record.relatedQuestionsForAnswerCount || 0,
        }}
      />
    </span>
  );
};

export default AnswerField;
