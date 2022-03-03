import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';

// because the sessions resource
// is named stats/session to make the api url resolution easier,
// we need this hack
const cleanResourceName = (resource) => {
  return resource === 'stats/sessions' ? 'sessions' : resource;
};

const ColumnConfig = ({
  columns, visible, onChange, resource,
}) => {
  const translate = useTranslate();

  const [open, setOpen] = useState(false);

  const handleCheckboxClick = (col) => (event) => {
    if (event.target.checked) {
      onChange([...visible, col.key]);
    } else {
      onChange(visible.filter((c) => c !== col.key));
    }
  };

  const isChecked = (col) => visible.includes(col.key);

  return (
    <>
      <Button
        color="primary"
        size="small"
        onClick={() => setOpen(true)}
      >
        <SettingsIcon size="small" /> {translate('misc.columns')}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {translate('misc.columns_config')}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            {columns.map((col) => (
              <FormControlLabel
                key={col.key}
                control={(
                  <Checkbox
                    checked={isChecked(col)}
                    onChange={handleCheckboxClick(col)}
                    name={col.key}
                  />
                )}
                label={translate(`resources.${cleanResourceName(resource)}.fields.${col.key}`)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            {translate('misc.ok')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ColumnConfig;
