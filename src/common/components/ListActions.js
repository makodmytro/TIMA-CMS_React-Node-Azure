import * as React from 'react';
import { cloneElement } from 'react';
import {
  CreateButton,
  ExportButton,
  sanitizeListRestProps,
  TopToolbar,
  useListContext,
} from 'react-admin';
import ColumnConfig from './ColumnConfig';
import defaultColumns from '../../default-columns.json';
import { useDisabledCreate, useIsAdmin } from '../../hooks';

export const getVisibleColumns = (columns, resource, defaults = []) => {
  const savedConfig = localStorage.getItem(`columns-${resource}`);

  if (savedConfig) {
    return JSON.parse(savedConfig);
  }

  if (defaults.length > 0) {
    return columns.filter((c) => defaults.includes(c.key)).map((c) => c.key);
  }

  if (defaultColumns && defaultColumns[resource] && defaultColumns[resource].length) {
    return columns.filter((c) => defaultColumns[resource].includes(c.key)).map((c) => c.key);
  }

  return columns.filter((c) => c.key !== 'updatedAt').map((c) => c.key);
};

export const handleColumnsChange = (resource, callback) => (columns) => {
  localStorage.setItem(`columns-${resource}`, JSON.stringify(columns));
  callback(columns);
};

const ListActions = (props) => {
  const {
    className,
    exporter,
    filters,
    maxResults,
    columns,
    visibleColumns,
    onColumnsChange,
    ...rest
  } = props;
  const {
    currentSort,
    resource,
    displayedFilters,
    filterValues,
    basePath,
    showFilter,
    total,
  } = useListContext();
  let disabled = false;

  if (resource === 'questions' || resource === 'answers') {
    disabled = useDisabledCreate();
  } else if (['topics', 'languages', 'users', 'groups'].includes(resource)) {
    disabled = !useIsAdmin();
  }

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
      { /* some rendering bug probably */ }
      { disabled && <CreateButton basePath={basePath} disabled />}
      { !disabled && <CreateButton basePath={basePath} />}

      <ExportButton
        disabled={total === 0 || disabled}
        resource={resource}
        sort={currentSort}
        filterValues={filterValues}
        maxResults={maxResults}
      />
      {columns && (
        <ColumnConfig
          resource={resource}
          columns={columns}
          visible={visibleColumns}
          onChange={onColumnsChange}
        />
      )}

    </TopToolbar>
  );
};

export default ListActions;
