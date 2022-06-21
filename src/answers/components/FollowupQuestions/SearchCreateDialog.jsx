import React from 'react';
import {
  useDataProvider,
  useNotify,
} from 'react-admin';
import QuestionsCreateDialog from '../../../questions/components/CreateDialog';
import useAnswer from '../../useAnswer';

const SearchCreateDialog = ({ record, open, onClose }) => {
  const { refresh } = useAnswer();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const afterCreate = async (created) => {
    try {
      await dataProvider.answersAddFollowup('answers', {
        id: record.id,
        question_id: created.id,
      });

      notify('The question was created and linked');
      refresh();
      onClose();
    } catch (err) {
      notify(err?.body?.message, 'error');
    }
  };

  return (
    <QuestionsCreateDialog
      open={open}
      onClose={onClose}
      initialValues={{
        fk_languageId: record.fk_languageId,
        fk_topicId: record.fk_topicId,
        isFollowup: true
      }}
      onSuccess={afterCreate}
    />
  );
};

export default SearchCreateDialog;
