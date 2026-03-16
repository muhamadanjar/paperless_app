import * as React from 'react';
import { ReactNode } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { Table } from '@tanstack/react-table';
import { Settings2, Eye, EyeOff } from 'lucide-react';

function DataGridColumnVisibility<TData>({ table, trigger }: { table: Table<TData>; trigger: ReactNode }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box onClick={handleClick} sx={{ display: 'inline-block' }}>
        {trigger}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        align-end="true"
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              borderRadius: 2,
              mt: 1,
              boxShadow: 4,
              border: '1px solid',
              borderColor: 'divider',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings2 size={16} />
            Toggle Columns
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
            .map((column) => {
              const isVisible = column.getIsVisible();
              return (
                <MenuItem
                  key={column.id}
                  onClick={() => column.toggleVisibility(!isVisible)}
                  sx={{ py: 1 }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={isVisible}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={column.columnDef.meta?.headerTitle || column.id}
                    primaryTypographyProps={{
                      variant: 'body2',
                      sx: { textTransform: 'capitalize', fontWeight: isVisible ? 500 : 400 }
                    }}
                  />
                  <Box sx={{ ml: 1, color: isVisible ? 'primary.main' : 'text.disabled', display: 'flex' }}>
                    {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </Box>
                </MenuItem>
              );
            })}
        </Box>
      </Menu>
    </>
  );
}

export { DataGridColumnVisibility };
