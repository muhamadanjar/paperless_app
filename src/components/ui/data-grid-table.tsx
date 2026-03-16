import * as React from 'react';
import { CSSProperties, Fragment, ReactNode } from 'react';
import {
  Checkbox,
  Box,
  Typography,
  CircularProgress,
  Stack,
  Fade,
  Grow,
} from '@mui/material';

import { useDataGrid } from '@/components/ui/data-grid';
import { Cell, Column, flexRender, Header, HeaderGroup, Row } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/libs/utils';
import { Inbox, Loader2 } from 'lucide-react';

const headerCellSpacingVariants = cva('', {
  variants: {
    size: {
      dense: 'px-2.5 h-10',
      default: 'px-4 h-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const bodyCellSpacingVariants = cva('', {
  variants: {
    size: {
      dense: 'px-2.5 py-2',
      default: 'px-4 py-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned();

  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 2 : 1,
  };
}

function DataGridTableBase({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <Box sx={{ position: 'relative', overflow: 'auto', width: '100%', borderRadius: 3 }}>
      <table
        data-slot="data-grid-table"
        className={cn(
          'w-full align-middle caption-bottom text-left rtl:text-right text-foreground font-normal text-sm',
          !props.tableLayout?.columnsDraggable && 'border-separate border-spacing-0',
          props.tableLayout?.width === 'fixed' ? 'table-fixed' : 'table-auto',
          props.tableClassNames?.base,
        )}
      >
        {children}
      </table>
    </Box>
  );
}

function DataGridTableHead({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <thead
      className={cn(
        'bg-muted/30 backdrop-blur-sm',
        props.tableClassNames?.header,
        props.tableLayout?.headerSticky && props.tableClassNames?.headerSticky,
      )}
    >
      {children}
    </thead>
  );
}

function DataGridTableHeadRow<TData>({
  children,
  headerGroup,
}: {
  children: ReactNode;
  headerGroup: HeaderGroup<TData>;
}) {
  const { props } = useDataGrid();

  return (
    <tr
      key={headerGroup.id}
      className={cn(
        props.tableLayout?.headerBorder && 'border-b border-divider',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'bg-transparent',
        props.tableLayout?.headerBackground === false && 'bg-transparent',
        props.tableClassNames?.headerRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableHeadRowCell<TData>({
  children,
  header,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  header: Header<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid();

  const { column } = header;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinned = isPinned === 'right' && column.getIsFirstColumn('right');
  const headerCellSpacing = headerCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <th
      key={header.id}
      ref={dndRef}
      style={{
        ...(props.tableLayout?.width === 'fixed' && {
          width: `${header.getSize()}px`,
        }),
        ...(props.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
      className={cn(
        'relative text-left rtl:text-right align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[0.7rem] [&:has([role=checkbox])]:pe-0 transition-colors duration-200',
        headerCellSpacing,
        props.tableLayout?.cellBorder && 'border-e border-divider',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&:not([data-pinned]):has(+[data-pinned])_div.cursor-col-resize:last-child]:opacity-0 [&[data-last-col=left]_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right]:last-child_div.cursor-col-resize:last-child]:opacity-0 [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-muted/95 data-pinned:backdrop-blur-md',
        header.column.columnDef.meta?.headerClassName,
        column.getIndex() === 0 || column.getIndex() === header.headerGroup.headers.length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </th>
  );
}

function DataGridTableHeadRowCellResize<TData>({ header }: { header: Header<TData, unknown> }) {
  const { column } = header;

  return (
    <div
      {...{
        onDoubleClick: () => column.resetSize(),
        onMouseDown: header.getResizeHandler(),
        onTouchStart: header.getResizeHandler(),
        className:
          'absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -end-2 z-10 flex justify-center before:absolute before:w-[2px] before:inset-y-2 before:bg-divider hover:before:bg-primary before:transition-colors before:rounded-full',
      }}
    />
  );
}

function DataGridTableRowSpacer() {
  return <tbody aria-hidden="true" className="h-3"></tbody>;
}

function DataGridTableBody({ children }: { children: ReactNode }) {
  const { props } = useDataGrid();

  return (
    <tbody
      className={cn(
        '[&_tr:last-child]:border-0',
        props.tableLayout?.rowRounded && '[&_td:first-child]:rounded-s-xl [&_td:last-child]:rounded-e-xl',
        props.tableClassNames?.body,
      )}
    >
      {children}
    </tbody>
  );
}

function DataGridTableBodyRowSkeleton({ children }: { children: ReactNode }) {
  const { table, props } = useDataGrid();

  return (
    <tr
      className={cn(
        'animate-pulse',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-b border-divider [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'odd:bg-muted/20 odd:hover:bg-muted/30',
        props.tableClassNames?.bodyRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableBodyRowSkeletonCell<TData>({ children, column }: { children: ReactNode; column: Column<TData> }) {
  const { props, table } = useDataGrid();
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <td
      className={cn(
        'align-middle',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e border-divider',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/95 data-pinned:backdrop-blur-md"',
        column.getIndex() === 0 || column.getIndex() === table.getVisibleFlatColumns().length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </td>
  );
}

function DataGridTableBodyRow<TData>({
  children,
  row,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  row: Row<TData>;
  dndRef?: React.Ref<HTMLTableRowElement>;
  dndStyle?: CSSProperties;
}) {
  const { props, table } = useDataGrid();

  return (
    <tr
      ref={dndRef}
      style={{ ...(dndStyle ? dndStyle : null) }}
      data-state={table.options.enableRowSelection && row.getIsSelected() ? 'selected' : undefined}
      onClick={() => props.onRowClick && props.onRowClick(row.original)}
      className={cn(
        'transition-all duration-200 hover:bg-muted/50 data-[state=selected]:bg-primary/5',
        props.onRowClick && 'cursor-pointer',
        !props.tableLayout?.stripped &&
          props.tableLayout?.rowBorder &&
          'border-b border-divider [&:not(:last-child)>td]:border-b',
        props.tableLayout?.cellBorder && '[&_>:last-child]:border-e-0',
        props.tableLayout?.stripped && 'odd:bg-muted/20 hover:bg-muted/40 transition-colors',
        table.options.enableRowSelection && '[&_>:first-child]:relative',
        props.tableClassNames?.bodyRow,
      )}
    >
      {children}
    </tr>
  );
}

function DataGridTableBodyRowExpandded<TData>({ row }: { row: Row<TData> }) {
  const { props, table } = useDataGrid();

  return (
    <tr className={cn(props.tableLayout?.rowBorder && '[&:not(:last-child)>td]:border-b border-divider')}>
      <td colSpan={row.getVisibleCells().length} className="bg-muted/10 p-4">
        <Grow in timeout={300}>
          <Box>
            {table
              .getAllColumns()
              .find((column) => column.columnDef.meta?.expandedContent)
              ?.columnDef.meta?.expandedContent?.(row.original)}
          </Box>
        </Grow>
      </td>
    </tr>
  );
}

function DataGridTableBodyRowCell<TData>({
  children,
  cell,
  dndRef,
  dndStyle,
}: {
  children: ReactNode;
  cell: Cell<TData, unknown>;
  dndRef?: React.Ref<HTMLTableCellElement>;
  dndStyle?: CSSProperties;
}) {
  const { props } = useDataGrid();

  const { column, row } = cell;
  const isPinned = column.getIsPinned();
  const isLastLeftPinned = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinned = isPinned === 'right' && column.getIsFirstColumn('right');
  const bodyCellSpacing = bodyCellSpacingVariants({
    size: props.tableLayout?.dense ? 'dense' : 'default',
  });

  return (
    <td
      key={cell.id}
      ref={dndRef}
      {...(props.tableLayout?.columnsDraggable && !isPinned ? { cell } : {})}
      style={{
        ...(props.tableLayout?.columnsPinnable && column.getCanPin() && getPinningStyles(column)),
        ...(dndStyle ? dndStyle : null),
      }}
      data-pinned={isPinned || undefined}
      data-last-col={isLastLeftPinned ? 'left' : isFirstRightPinned ? 'right' : undefined}
      className={cn(
        'align-middle text-sm font-medium text-foreground/80',
        bodyCellSpacing,
        props.tableLayout?.cellBorder && 'border-e border-divider',
        props.tableLayout?.columnsResizable && column.getCanResize() && 'truncate',
        cell.column.columnDef.meta?.cellClassName,
        props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          '[&[data-pinned=left][data-last-col=left]]:border-e! [&[data-pinned=right][data-last-col=right]]:border-s! [&[data-pinned][data-last-col]]:border-border data-pinned:bg-background/95 data-pinned:backdrop-blur-md"',
        column.getIndex() === 0 || column.getIndex() === row.getVisibleCells().length - 1
          ? props.tableClassNames?.edgeCell
          : '',
      )}
    >
      {children}
    </td>
  );
}

function DataGridTableEmpty() {
  const { table, props } = useDataGrid();
  const totalColumns = table.getAllColumns().length;

  return (
    <Fade in timeout={500}>
      <tr>
        <td colSpan={totalColumns} className="py-20">
          <Stack alignItems="center" spacing={2} sx={{ color: 'text.disabled' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'action.hover',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Inbox size={32} strokeWidth={1} />
            </Box>
            <Stack alignItems="center">
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {props.emptyMessage || 'No results found'}
              </Typography>
              <Typography variant="body2">
                Try adjusting your search or filters to find what you're looking for.
              </Typography>
            </Stack>
          </Stack>
        </td>
      </tr>
    </Fade>
  );
}

function DataGridTableLoader() {
  const { props } = useDataGrid();

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
      }}
    >
      <Fade in>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            bgcolor: 'background.paper',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            boxShadow: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CircularProgress size={20} thickness={5} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {props.loadingMessage || 'Fetching records...'}
          </Typography>
        </Stack>
      </Fade>
    </Box>
  );
}

function DataGridTableRowSelect<TData>({ row, size }: { row: Row<TData>; size?: 'small' | 'medium' | 'large' }) {
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          position: 'absolute',
          left: -4,
          top: 0,
          bottom: 0,
          width: 3,
          bgcolor: 'primary.main',
          borderRadius: '0 4px 4px 0',
          transform: row.getIsSelected() ? 'scaleY(1)' : 'scaleY(0)',
          transition: 'transform 0.2s',
        }}
      />
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(event) => row.toggleSelected(event.target.checked)}
        aria-label="Select row"
        size={size ?? 'small'}
        sx={{
          color: 'divider',
          '&.Mui-checked': {
            color: 'primary.main',
          },
        }}
      />
    </Box>
  );
}

function DataGridTableRowSelectAll({ size }: { size?: 'small' | 'medium' | 'large' }) {
  const { table, recordCount, isLoading } = useDataGrid();

  return (
    <Checkbox
      checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
      indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
      disabled={isLoading || recordCount === 0}
      onChange={(event) => table.toggleAllPageRowsSelected(event.target.checked)}
      aria-label="Select all"
      size={size ?? 'small'}
      sx={{
        color: 'divider',
        '&.Mui-checked, &.MuiCheckbox-indeterminate': {
          color: 'primary.main',
        },
      }}
    />
  );
}

function DataGridTable<TData>() {
  const { table, isLoading, props } = useDataGrid();
  const pagination = table.getState().pagination;

  return (
    <Box sx={{ position: 'relative' }}>
      <DataGridTableBase>
        <DataGridTableHead>
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>, index) => {
            return (
              <DataGridTableHeadRow headerGroup={headerGroup} key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;

                  return (
                    <DataGridTableHeadRowCell header={header} key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {props.tableLayout?.columnsResizable && column.getCanResize() && (
                        <DataGridTableHeadRowCellResize header={header} />
                      )}
                    </DataGridTableHeadRowCell>
                  );
                })}
              </DataGridTableHeadRow>
            );
          })}
        </DataGridTableHead>

        {(props.tableLayout?.stripped || !props.tableLayout?.rowBorder) && <DataGridTableRowSpacer />}

        <DataGridTableBody>
          {props.loadingMode === 'skeleton' && isLoading && pagination?.pageSize ? (
            Array.from({ length: pagination.pageSize }).map((_, rowIndex) => (
              <DataGridTableBodyRowSkeleton key={rowIndex}>
                {table.getVisibleFlatColumns().map((column, colIndex) => {
                  return (
                    <DataGridTableBodyRowSkeletonCell column={column} key={colIndex}>
                      {column.columnDef.meta?.skeleton}
                    </DataGridTableBodyRowSkeletonCell>
                  );
                })}
              </DataGridTableBodyRowSkeleton>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row: Row<TData>, index) => {
              return (
                <Fragment key={row.id}>
                  <DataGridTableBodyRow row={row} key={row.id}>
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => {
                      return (
                        <DataGridTableBodyRowCell cell={cell} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </DataGridTableBodyRowCell>
                      );
                    })}
                  </DataGridTableBodyRow>
                  {row.getIsExpanded() && <DataGridTableBodyRowExpandded row={row} />}
                </Fragment>
              );
            })
          ) : !isLoading && (
            <DataGridTableEmpty />
          )}
        </DataGridTableBody>
      </DataGridTableBase>
      {isLoading && props.loadingMode === 'spinner' && <DataGridTableLoader />}
    </Box>
  );
}

export {
  DataGridTable,
  DataGridTableBase,
  DataGridTableBody,
  DataGridTableBodyRow,
  DataGridTableBodyRowCell,
  DataGridTableBodyRowExpandded,
  DataGridTableBodyRowSkeleton,
  DataGridTableBodyRowSkeletonCell,
  DataGridTableEmpty,
  DataGridTableHead,
  DataGridTableHeadRow,
  DataGridTableHeadRowCell,
  DataGridTableHeadRowCellResize,
  DataGridTableLoader,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
  DataGridTableRowSpacer,
};
