import * as React from 'react';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/libs/utils';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useDataGrid } from '@/components/ui/data-grid';
import { Column } from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
  ArrowUp,
  Check,
  ChevronsUpDown,
  PinOff,
  Settings2,
  Eye,
  MoreVertical,
} from 'lucide-react';

interface DataGridColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  icon?: ReactNode;
  pinnable?: boolean;
  filter?: ReactNode;
  visibility?: boolean;
}

function DataGridColumnHeader<TData, TValue>({
  column,
  title = '',
  icon,
  className,
  filter,
  visibility = false,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { isLoading, table, props, recordCount } = useDataGrid();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [columnMenuAnchorEl, setColumnMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const columnMenuOpen = Boolean(columnMenuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setColumnMenuAnchorEl(null);
  };

  const handleColumnMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setColumnMenuAnchorEl(event.currentTarget);
  };

  const moveColumn = (direction: 'left' | 'right') => {
    const currentOrder = [...table.getState().columnOrder];
    const currentIndex = currentOrder.indexOf(column.id);

    if (direction === 'left' && currentIndex > 0) {
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex - 1, 0, movedColumn);
      table.setColumnOrder(newOrder);
    }

    if (direction === 'right' && currentIndex < currentOrder.length - 1) {
      const newOrder = [...currentOrder];
      const [movedColumn] = newOrder.splice(currentIndex, 1);
      newOrder.splice(currentIndex + 1, 0, movedColumn);
      table.setColumnOrder(newOrder);
    }
  };

  const canMove = (direction: 'left' | 'right'): boolean => {
    const currentOrder = table.getState().columnOrder;
    const currentIndex = currentOrder.indexOf(column.id);
    return direction === 'left' ? currentIndex > 0 : currentIndex < currentOrder.length - 1;
  };

  const headerLabel = () => (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        fontSize: '0.8125rem',
        color: 'text.secondary',
        fontWeight: 500,
      }}
      className={className}
    >
      {icon}
      {title}
    </Box>
  );

  const headerButton = () => {
    const isSorted = column.getIsSorted();
    return (
      <Button
        variant="text"
        size="small"
        className={cn(
          'text-secondary-foreground rounded-md font-medium px-2 py-1 h-8 hover:bg-muted/50 transition-all duration-200',
          className,
        )}
        disabled={isLoading || recordCount === 0}
        onClick={() => {
          if (isSorted === 'asc') column.toggleSorting(true);
          else if (isSorted === 'desc') column.clearSorting();
          else column.toggleSorting(false);
        }}
        endIcon={
          column.getCanSort() && (
            <Box component="span" sx={{ display: 'flex', opacity: 0.7 }}>
              {isSorted === 'desc' ? (
                <ArrowDown size={14} />
              ) : isSorted === 'asc' ? (
                <ArrowUp size={14} />
              ) : (
                <ChevronsUpDown size={14} />
              )}
            </Box>
          )
        }
        startIcon={icon && <Box sx={{ display: 'flex' }}>{icon}</Box>}
        sx={{
          textTransform: 'none',
          color: isSorted ? 'primary.main' : 'text.secondary',
          '&:hover': {
            color: 'text.primary',
          },
        }}
      >
        {title}
      </Button>
    );
  };

  const headerControls = () => {
    const isPinned = column.getIsPinned();
    const isSorted = column.getIsSorted();

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, width: '100%', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {headerButton()}
          <Tooltip title="Actions">
            <IconButton
              size="small"
              onClick={handleClick}
              className="ml-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
              sx={{ color: 'text.disabled', '&:hover': { color: 'text.primary' } }}
            >
              <MoreVertical size={14} />
            </IconButton>
          </Tooltip>
        </Box>

        {props.tableLayout?.columnsPinnable && column.getCanPin() && isPinned && (
          <Tooltip title={`Unpin ${title}`}>
            <IconButton
              size="small"
              onClick={() => column.pin(false)}
              sx={{ color: 'primary.main', opacity: 0.8, '&:hover': { opacity: 1 } }}
            >
              <PinOff size={14} />
            </IconButton>
          </Tooltip>
        )}

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionProps={{ timeout: 200 }}
          slotProps={{
            paper: {
              elevation: 3,
              sx: {
                minWidth: 180,
                borderRadius: 2,
                mt: 1,
                border: '1px solid',
                borderColor: 'divider',
              },
            },
          }}
        >
          {filter && (
            <Box sx={{ px: 2, py: 1 }}>
              {filter}
            </Box>
          )}
          {filter && (column.getCanSort() || column.getCanPin() || visibility) && <Divider sx={{ my: 1 }} />}

          {column.getCanSort() && (
            <Box>
              <MenuItem
                onClick={() => {
                  isSorted === 'asc' ? column.clearSorting() : column.toggleSorting(false);
                  handleClose();
                }}
              >
                <ListItemIcon><ArrowUp size={16} /></ListItemIcon>
                <ListItemText primary="Ascending" />
                {isSorted === 'asc' && <Check size={16} className="text-primary" />}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  isSorted === 'desc' ? column.clearSorting() : column.toggleSorting(true);
                  handleClose();
                }}
              >
                <ListItemIcon><ArrowDown size={16} /></ListItemIcon>
                <ListItemText primary="Descending" />
                {isSorted === 'desc' && <Check size={16} className="text-primary" />}
              </MenuItem>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}

          {props.tableLayout?.columnsPinnable && column.getCanPin() && (
            <Box>
              <MenuItem onClick={() => { column.pin(isPinned === 'left' ? false : 'left'); handleClose(); }}>
                <ListItemIcon><ArrowLeftToLine size={16} /></ListItemIcon>
                <ListItemText primary="Pin to Left" />
                {isPinned === 'left' && <Check size={16} className="text-primary" />}
              </MenuItem>
              <MenuItem onClick={() => { column.pin(isPinned === 'right' ? false : 'right'); handleClose(); }}>
                <ListItemIcon><ArrowRightToLine size={16} /></ListItemIcon>
                <ListItemText primary="Pin to Right" />
                {isPinned === 'right' && <Check size={16} className="text-primary" />}
              </MenuItem>
              <Divider sx={{ my: 1 }} />
            </Box>
          )}

          {props.tableLayout?.columnsMovable && (
            <Box>
              <MenuItem
                onClick={() => { moveColumn('left'); handleClose(); }}
                disabled={!canMove('left') || isPinned !== false}
              >
                <ListItemIcon><ArrowLeft size={16} /></ListItemIcon>
                <ListItemText primary="Move Left" />
              </MenuItem>
              <MenuItem
                onClick={() => { moveColumn('right'); handleClose(); }}
                disabled={!canMove('right') || isPinned !== false}
              >
                <ListItemIcon><ArrowRight size={16} /></ListItemIcon>
                <ListItemText primary="Move Right" />
              </MenuItem>
            </Box>
          )}

          {props.tableLayout?.columnsVisibility && visibility && (
            <Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleColumnMenuClick}>
                <ListItemIcon><Settings2 size={16} /></ListItemIcon>
                <ListItemText primary="Columns Visibility" />
                <ArrowRight size={14} className="opacity-50" />
              </MenuItem>

              <Menu
                anchorEl={columnMenuAnchorEl}
                open={columnMenuOpen}
                onClose={() => setColumnMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                  paper: {
                    elevation: 4,
                    sx: { minWidth: 200, borderRadius: 2, border: '1px solid', borderColor: 'divider' },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="overline" color="text.disabled" sx={{ fontWeight: 700 }}>
                        Visible Columns
                    </Typography>
                </Box>
                {table
                  .getAllColumns()
                  .filter((col) => typeof col.accessorFn !== 'undefined' && col.getCanHide())
                  .map((col) => (
                    <MenuItem
                      key={col.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        col.toggleVisibility(!col.getIsVisible());
                      }}
                    >
                      <ListItemIcon>
                        {col.getIsVisible() ? <Check size={16} className="text-primary" /> : <Box sx={{ width: 16 }} />}
                      </ListItemIcon>
                      <ListItemText
                        primary={col.columnDef.meta?.headerTitle || col.id}
                        sx={{ textTransform: 'capitalize' }}
                      />
                      {col.getIsVisible() ? <Eye size={14} className="opacity-50" /> : <Box sx={{ width: 14 }} />}
                    </MenuItem>
                  ))}
              </Menu>
            </Box>
          )}
        </Menu>
      </Box>
    );
  };

  if (
    props.tableLayout?.columnsMovable ||
    (props.tableLayout?.columnsVisibility && visibility) ||
    (props.tableLayout?.columnsPinnable && column.getCanPin()) ||
    filter
  ) {
    return <div className="group h-full">{headerControls()}</div>;
  }

  if (column.getCanSort() || (props.tableLayout?.columnsResizable && column.getCanResize())) {
    return <div className="flex items-center h-full">{headerButton()}</div>;
  }

  return headerLabel();
}

export { DataGridColumnHeader, type DataGridColumnHeaderProps };
