import React from 'react';
import { useTranslate, useRedirect } from 'react-admin';
import { Link } from 'react-router-dom'; // eslint-disable-line
import Button from '@material-ui/core/Button';
import AnswerTextField from '../../answers/components/TextField';
import AnswerLinkDialog from './AnswerLinkDialog';

const AnswerField = ({ record }) => {
  const translate = useTranslate();
  const redirect = useRedirect();

  if (!record) {
    return null;
  }

  if (!record.fk_answerId) {
    return (
      <AnswerLinkDialog record={record} />
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
