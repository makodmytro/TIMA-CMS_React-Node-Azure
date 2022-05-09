import React, { cloneElement } from 'react';
import { useHistory } from 'react-router-dom'; // eslint-disable-line
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
import columns from './columns';

const TOPICS_TREE_CHILD_COLOR = process.env.REACT_APP_TOPICS_TREE_CHILD_COLOR || '498ca752';
const TOPICS_ENABLE_TREE_LIST = process.env.REACT_APP_TOPICS_ENABLE_TREE_LIST || '1';

const Row = ({
  record,
  columnsToDisplay,
  onSync,
  setOpen,
  level,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const history = useHistory();

  const bg = !level ? 'initial' : `#${(parseInt(TOPICS_TREE_CHILD_COLOR, 16) + 32 * level).toString(16)}`;

  return (
    <>
      <TableRow style={{ backgroundColor: bg, cursor: 'pointer' }} onClick={() => history.push(`/topics/${record?.id}`)}>
        <TableCell>
          {
            !!record.ChildTopics && record.ChildTopics.length > 0 && TOPICS_ENABLE_TREE_LIST === '1' && (
              <>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();

                    setExpanded(!expanded);
                  }}
                >
                  { !expanded && <AddIcon fontSize="small" /> }
                  { expanded && <MinusIcon fontSize="small" /> }
                </IconButton>
              </>
            )
          }
        </TableCell>
        {
          !level && columnsToDisplay
            .map((col, ii) => {
              return (
                <TableCell key={ii}>
                  {cloneElement(col.el, { key: col.key, record })}
                </TableCell>
              );
            })
        }
        {
          level && level > 0 && (
            <>
              <TableCell style={{ paddingLeft: `${30 * level}px` }}>
                {cloneElement(columns[0].el, { key: columns[0].key, record })}
              </TableCell>
              {
                (Array.from(Array(columnsToDisplay.length - 1).keys())).map((v, i) => (
                  <TableCell key={i}>&nbsp;</TableCell>
                ))
              }
            </>
          )
        }
        <TableCell>
          <ListDropdownMenu
            onSync={onSync}
            onPermissionsClick={level > 0 ? null : (id) => setOpen(id)}
            record={record}
            showCreateChild={!level || level < 2}
          />
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
                  level={(level || 0) + 1}
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
