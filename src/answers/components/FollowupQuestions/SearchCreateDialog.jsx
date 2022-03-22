import React from 'react';
import {
  useDataProvider,
  useRefresh,
  useNotify,
} from 'react-admin';
import QuestionsSearchCreateDialog from '../../../questions/components/SearchCreateDialog';

const SearchCreateDialog = ({ record, open, onClose }) => {
  const refresh = useRefresh();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const afterCreate = async (created) => {
    await dataProvider.answersAddFollowup('answers', {
      id: record.id,
      question_id: created.id,
    });

    notify('The question was created and linked');
    refresh();
    onClose();
  };

  const selectedButtonOnClick = async (selected) => {
    try {
      await Promise.all(
        selected.map((id) => {
          return dataProvider.answersAddFollowup('answers', {
            id: record.id,
            question_id: id,
          });
        }),
      );

      notify('The questions were set as follow up');
      refresh();
      onClose();
    } catch (err) {
      notify(`Failed to link questions: ${err.message}`, 'error');
    }
  };

  return (
    <QuestionsSearchCreateDialog
      open={open}
      onClose={onClose}
      record={record}
      createInitialValues={{
        fk_languageId: record.fk_languageId,
        fk_topicId: record.fk_topicId,
      }}
      afterCreate={afterCreate}
      selectedButtonText="resources.answers.set_followup"
      selectedButtonOnClick={selectedButtonOnClick}
    />
  );
};

export default SearchCreateDialog;
