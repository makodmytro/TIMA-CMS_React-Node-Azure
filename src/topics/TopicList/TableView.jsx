import React, { cloneElement } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';
import { useTranslate } from 'react-admin';
import ListDropdownMenu from '../components/list-dropdown-menu';

const Row = ({
  record,
  columnsToDisplay,
  onSync,
  setOpen,
  isChild,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <TableRow style={{ backgroundColor: isChild ? '#f9f4e7' : 'initial' }}>
        <TableCell>
          {
            record.ChildTopics && !!record.ChildTopics.length && (
              <>
                <IconButton size="small" color="primary" onClick={() => setExpanded(!expanded)}>
                  { !expanded && <AddIcon fontSize="small" /> }
                  { expanded && <MinusIcon fontSize="small" /> }
                </IconButton>
              </>
            )
          }
        </TableCell>
        {
          columnsToDisplay
            .map((col, ii) => {
              return (
                <TableCell key={ii}>
                  {cloneElement(col.el, { key: col.key, record })}
                </TableCell>
              );
            })
        }
        <TableCell>
          <ListDropdownMenu onSync={onSync} onPermissionsClick={(id) => setOpen(id)} record={record} />
        </TableCell>
      </TableRow>
      {
        expanded && record.ChildTopics && !!record.ChildTopics.length && (
          <>
            {
              record.ChildTopics.map((child, iii) => (
                <Row
                  record={child}
                  columnsToDisplay={columnsToDisplay}
                  onSync={onSync}
                  setOpen={setOpen}
                  key={iii}
                  isChild
                />
              ))
            }
          </>
        )
      }
    </>
  );
};

const TableView = ({
  columnsToDisplay,
  records,
  setOpen,
  onSync,
  count,
  pagination,
  setPage,
  setPageSize,
}) => {
  const translate = useTranslate();

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>&nbsp;</TableCell>
            {
              columnsToDisplay.map((c) => (
                <TableCell key={c.key}>
                  {translate(`resources.topics.fields.${c.key}`)}
                </TableCell>
              ))
            }
            <TableCell>&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            records.map((record, i) => (
              <Row
                key={i}
                {...{
                  record,
                  setOpen,
                  onSync,
                  columnsToDisplay,
                }}
              />
            ))
          }
        </TableBody>
      </Table>
      <Box textAlign="right">
        <TablePagination
          component="div"
          count={count}
          page={pagination.page - 1}
          onChangePage={(e, value) => {
            setPage(value);
          }}
          rowsPerPage={pagination.perPage}
          rowsPerPageOptions={[1, 5, 10, 15]}
          onChangeRowsPerPage={(e) => {
            const value = parseInt(e.target.value, 10);
            setPageSize(value);
          }}
        />
      </Box>
    </>
  );
};

export default TableView;
