import React from 'react';
import { useDataProvider, useNotify } from 'react-admin';
import QuestionsSearchCreateDialog from '../../../questions/components/SearchCreateDialog';
import useAnswer from '../../useAnswer';

const SearchCreateDialog = ({ record, open, onClose, relatedOpen = false }) => {
  const { refresh } = useAnswer();
  const notify = useNotify();
  const dataProvider = useDataProvider();

  const afterCreate = () => {
    notify('The question was created and linked');
    refresh();
    onClose();
  };

  const selectedButtonOnClick = async (selected) => {
    try {
      await Promise.all(
        selected.map((id) => {
          return dataProvider.update('questions', {
            id,
            data: {
              fk_answerId: record.id,
              fk_topicId: record.fk_topicId,
            },
          });
        })
      );

      notify('The questions were linked');
      refresh();
      onClose();
    } catch (err) {
      notify(`Failed to link questions: ${err.message}`, 'error');
    }
  };

  return (
    <QuestionsSearchCreateDialog
      open={open}
      relatedOpen={relatedOpen}
      onClose={onClose}
      record={record}
      createInitialValues={{
        fk_languageId: record.fk_languageId,
        fk_answerId: record.id,
        fk_topicId: record.fk_topicId,
      }}
      afterCreate={afterCreate}
      selectedButtonText="resources.answers.link_questions"
      selectedButtonOnClick={selectedButtonOnClick}
    />
  );
};

export default SearchCreateDialog;
