import React, { useState } from 'react';
import { useDataProvider, useNotify, useTranslate } from 'react-admin';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Close from '@material-ui/icons/Close';
import Edit from '@material-ui/icons/Edit';
import useAnswer from '../useAnswer';

export const EditableStatusField = ({ record, children }) => {
  const [editMode, setEditMode] = useState(false);
  const statuses = useSelector((state) => state.custom.workflowStatus);

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
        status: statusId,
      });
      refresh();
      notify('The record has been updated');
    } catch (err) {
      refresh();
      const msg = err?.body?.code
        ? translate(`resources.users.workflow.errors.${err.body.code}`)
        : err?.body?.message || 'We could not execute the action';
      notify(msg, 'error');
    } finally {
      setEditMode(false);
    }
  };

  const options = statuses
    .filter((o) => (record?.possibleNextStatus || []).includes(o.value))
    .map((o) => ({ id: o.value, name: translate(`resources.users.workflow.status.${o.name}`) }));
  const matching = statuses.find((s) => s.value === record?.status);

  if (matching && !options.find((o) => o.id === matching.value)) {
    options.push({ id: matching.value, name: translate(`resources.users.workflow.status.${matching.name}`) });
  }

  if (!record || !record.status || !record?.possibleNextStatus.length) {
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
                value={record?.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                variant="filled"
                margin="dense"
                fullWidth
              >
                {options.map((o) => (
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
