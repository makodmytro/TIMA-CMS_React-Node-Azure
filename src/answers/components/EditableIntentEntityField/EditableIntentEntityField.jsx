import React, { useState } from 'react';
import { useDataProvider, useNotify, useTranslate } from 'react-admin';
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Close, Edit } from '@material-ui/icons';
import useAnswer from '../../useAnswer';

const intentOptions = [
  {
    id: 0,
    name: 'Lorem Ipsum 0',
  },
  {
    id: 1,
    name: 'Lorem Ipsum 1',
  },
];

const EditableIntentEntityField = ({ record, children }) => {
  const [editMode, setEditMode] = useState(false);

  const dataProvider = useDataProvider();
  const notify = useNotify();
  const { refresh } = useAnswer(record.id);
  const translate = useTranslate();

  const handleStatusChange = async (statusId) => {
    if (statusId === record?.status) {
      setEditMode(false);
      return;
    }

    try {
      await dataProvider.updateAnswerStatus('answers', {
        id: record?.id,
      });
      refresh();
      notify('The record has been updated');
    } catch (err) {
      refresh();
    } finally {
      setEditMode(false);
    }
  };

  if (!record) {
    return children;
  }

  return (
    <>
      <Box style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }} onClick={(e) => e.stopPropagation()}>
        {editMode ? (
          <>
            <FormControl fullWidth>
              <InputLabel
                id={`change-label-${record.id}`}
                style={{
                  transform: 'translate(12px, 7px) scale(0.75)',
                }}
              >
                {translate('resources.answers.fields.status')}
              </InputLabel>
              <Select
                labelId={`change-label-${record.id}`}
                size="small"
                value={1}
                onChange={(e) => handleStatusChange(e.target.value)}
                variant="filled"
                margin="dense"
                fullWidth
              >
                {intentOptions.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton onClick={() => setEditMode(false)} size="medium">
              <Close style={{ fontSize: 20 }} />
            </IconButton>
          </>
        ) : (
          <>
            {children}

            <IconButton onClick={() => setEditMode(true)} size="medium">
              <Edit style={{ fontSize: 20 }} />
            </IconButton>
          </>
        )}
      </Box>
    </>
  );
};

export default EditableIntentEntityField;
