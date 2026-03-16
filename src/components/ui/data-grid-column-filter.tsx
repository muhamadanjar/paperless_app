import * as React from 'react';
import { cn } from '@/libs/utils';
import {
  Badge,
  Button,
  Popover,
  Box,
  TextField,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  Typography,
  Chip,
  Stack,
  InputAdornment,
} from '@mui/material';
import { Column } from '@tanstack/react-table';
import { Check, CirclePlus, Search, X } from 'lucide-react';

interface DataGridColumnFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

function DataGridColumnFilter<TData, TValue>({
  column,
  title,
  options,
}: DataGridColumnFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [searchValue, setSearchValue] = React.useState('');

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchValue('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'column-filter-popover' : undefined;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const toggleOption = (value: string) => {
    const nextValues = new Set(selectedValues);
    if (nextValues.has(value)) {
      nextValues.delete(value);
    } else {
      nextValues.add(value);
    }
    const filterValues = Array.from(nextValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClick}
        startIcon={<CirclePlus size={16} />}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          borderColor: 'divider',
          color: 'text.secondary',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
          ...(selectedValues.size > 0 && {
            borderStyle: 'dashed',
          }),
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title}
        </Typography>

        {selectedValues?.size > 0 && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 0.5 }} />
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {selectedValues.size > 2 ? (
                <Chip
                  label={`${selectedValues.size} selected`}
                  size="small"
                  color="primary"
                  variant="filled"
                  sx={{ height: 20, fontSize: '0.75rem' }}
                />
              ) : (
                options
                  .filter((option) => selectedValues.has(option.value))
                  .map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      size="small"
                      color="primary"
                      variant="filled"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  ))
              )}
            </Box>
          </>
        )}
      </Button>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 240,
              mt: 1,
              borderRadius: 2,
              boxShadow: 4,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box sx={{ p: 1.5, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={`Filter ${title}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} />
                </InputAdornment>
              ),
              sx: { fontSize: '0.875rem', borderRadius: 1.5 },
            }}
          />
        </Box>

        <Divider />

        <List sx={{ maxHeight: 300, overflow: 'auto', py: 0.5 }}>
          {filteredOptions.length === 0 ? (
            <Box sx={{ py: 3, px: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.disabled">
                No results found.
              </Typography>
            </Box>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.has(option.value);
              const count = facets?.get(option.value);

              return (
                <ListItemButton
                  key={option.value}
                  onClick={() => toggleOption(option.value)}
                  sx={{
                    py: 0.75,
                    px: 1.5,
                    borderRadius: 1,
                    mx: 0.5,
                    mb: 0.25,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox
                      edge="start"
                      checked={isSelected}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                      sx={{ p: 0.5 }}
                    />
                  </ListItemIcon>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
                    {option.icon && (
                      <Box sx={{ color: 'text.disabled', display: 'flex' }}>
                        <option.icon className="size-4" />
                      </Box>
                    )}
                    <ListItemText
                      primary={option.label}
                      primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: isSelected ? 600 : 400 } }}
                    />
                  </Box>
                  {count !== undefined && (
                    <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace', ml: 1 }}>
                      {count}
                    </Typography>
                  )}
                </ListItemButton>
              );
            })
          )}
        </List>

        {selectedValues.size > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 0.5 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => {
                  column?.setFilterValue(undefined);
                  handleClose();
                }}
                sx={{
                  py: 1,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
                }}
              >
                Clear all filters
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </Box>
  );
}

export { DataGridColumnFilter, type DataGridColumnFilterProps };
