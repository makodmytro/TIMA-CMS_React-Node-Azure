import React, { cloneElement, useState } from 'react';
import {
  Datagrid, DateField, List, TextField,
} from 'react-admin';
import { PlayableTextField } from '../common/components/playable-text';
import ListActions from '../common/components/ListActions';

const LanguageList = (props) => {
  const columns = [
    {
      key: 'code',
      el: <TextField source="code" />,
    },
    {
      key: 'name',
      el: <TextField source="name" />,
    },
    {
      key: 'welcomeText',
      el: <PlayableTextField source="welcomeText" />,

    },
    {
      key: 'welcomeButton',
      el: <TextField source="welcomeButton" />,

    },
    {
      key: 'updatedAt',
      el: <DateField source="updatedAt" showTime />,

    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    columns.filter((c) => c.key !== 'updatedAt').map((c) => c.key),
  );

  return (
    <List
      {...props}
      actions={(
        <ListActions
          visibleColumns={visibleColumns}
          onColumnsChange={setVisibleColumns}
          columns={columns}
        />
)}
      bulkActionButtons={false}
    >
      <Datagrid rowClick="edit">
        {columns.filter((col) => visibleColumns.includes(col.key))
          .map((col) => cloneElement(col.el, { key: col.key }))}
      </Datagrid>
    </List>
  );
};

export default LanguageList;
