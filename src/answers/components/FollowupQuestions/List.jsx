import React from 'react';
import { Box } from '@material-ui/core';
import Table from './Table';

const List = ({ record }) => {
  return (
    <>
      <Box p={2}>
        <Table record={record} />
      </Box>
    </>
  );
};

export default List;
