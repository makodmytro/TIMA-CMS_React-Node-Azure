import * as React from 'react';
import { cloneElement } from 'react';
import {
  CreateButton, sanitizeListRestProps, TopToolbar, useListContext, ExportButton,
} from 'react-admin';
import ColumnConfig from './ColumnConfig';

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
  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      {filters && cloneElement(filters, {
        resource,
        showFilter,
        displayedFilters,
        filterValues,
        context: 'button',
      })}
      <CreateButton basePath={basePath} />
      <ExportButton
        disabled={total === 0}
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
