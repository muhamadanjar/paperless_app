import { ReactNode } from 'react';
import { useDataGrid } from '@/components/ui/data-grid';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontal } from 'lucide-react';
import { cn } from '@/libs/utils';
import {
  Button,
  MenuItem,
  Select,
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';

interface DataGridPaginationProps {
  sizes?: number[];
  sizesInfo?: string;
  sizesLabel?: string;
  sizesDescription?: string;
  sizesSkeleton?: ReactNode;
  more?: boolean;
  moreLimit?: number;
  info?: string;
  infoSkeleton?: ReactNode;
  className?: string;
}

function DataGridPagination(props: DataGridPaginationProps) {
  const { table, recordCount, isLoading } = useDataGrid();

  const defaultProps: Partial<DataGridPaginationProps> = {
    sizes: [5, 10, 25, 50, 100],
    sizesLabel: 'Rows per page',
    sizesDescription: 'per page',
    sizesSkeleton: <Skeleton className="h-8 w-44" />,
    moreLimit: 5,
    more: false,
    info: '{from} - {to} of {count}',
    infoSkeleton: <Skeleton className="h-8 w-60" />,
  };

  const mergedProps: DataGridPaginationProps = { ...defaultProps, ...props };

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const from = recordCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, recordCount);
  const pageCount = table.getPageCount();

  const paginationInfo = mergedProps?.info
    ? mergedProps.info
        .replace('{from}', from.toString())
        .replace('{to}', to.toString())
        .replace('{count}', recordCount.toString())
    : `${from} - ${to} of ${recordCount}`;

  const paginationMoreLimit = mergedProps?.moreLimit || 5;

  const currentGroupStart = Math.floor(pageIndex / paginationMoreLimit) * paginationMoreLimit;
  const currentGroupEnd = Math.min(currentGroupStart + paginationMoreLimit, pageCount);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = currentGroupStart; i < currentGroupEnd; i++) {
      const isActive = pageIndex === i;
      buttons.push(
        <Button
          key={i}
          size="small"
          variant={isActive ? 'contained' : 'text'}
          disableElevation
          sx={{
            minWidth: 32,
            height: 32,
            p: 0,
            borderRadius: 1.5,
            fontSize: '0.8125rem',
            fontWeight: isActive ? 600 : 400,
            color: isActive ? 'primary.contrastText' : 'text.secondary',
            '&:hover': {
              bgcolor: isActive ? 'primary.main' : 'action.hover',
              color: isActive ? 'primary.contrastText' : 'text.primary',
            },
          }}
          onClick={() => {
            if (pageIndex !== i) {
              table.setPageIndex(i);
            }
          }}
        >
          {i + 1}
        </Button>,
      );
    }
    return buttons;
  };

  const renderEllipsisPrevButton = () => {
    if (currentGroupStart > 0) {
      return (
        <IconButton
          size="small"
          onClick={() => table.setPageIndex(currentGroupStart - 1)}
          sx={{ width: 32, height: 32 }}
        >
          <MoreHorizontal size={14} />
        </IconButton>
      );
    }
    return null;
  };

  const renderEllipsisNextButton = () => {
    if (currentGroupEnd < pageCount) {
      return (
        <IconButton
          size="small"
          onClick={() => table.setPageIndex(currentGroupEnd)}
          sx={{ width: 32, height: 32 }}
        >
          <MoreHorizontal size={14} />
        </IconButton>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        py: 2,
        px: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
      className={mergedProps?.className}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {isLoading ? (
          mergedProps?.sizesSkeleton
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              {mergedProps.sizesLabel}
            </Typography>
            <Select
              size="small"
              value={`${pageSize}`}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              sx={{
                height: 32,
                fontSize: '0.8125rem',
                borderRadius: 1.5,
                bgcolor: 'background.default',
                '& .MuiSelect-select': { py: 0.5, px: 1.5 },
              }}
            >
              {mergedProps?.sizes?.map((size: number) => (
                <MenuItem key={size} value={`${size}`} sx={{ fontSize: '0.8125rem' }}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        spacing={{ xs: 1.5, sm: 3 }}
      >
        {isLoading ? (
          mergedProps?.infoSkeleton
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {paginationInfo}
            </Typography>

            {pageCount > 1 && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Tooltip title="Previous page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      sx={{ width: 32, height: 32 }}
                    >
                      <ChevronLeftIcon size={18} />
                    </IconButton>
                  </span>
                </Tooltip>

                {renderEllipsisPrevButton()}
                {renderPageButtons()}
                {renderEllipsisNextButton()}

                <Tooltip title="Next page">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      sx={{ width: 32, height: 32 }}
                    >
                      <ChevronRightIcon size={18} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}

export { DataGridPagination, type DataGridPaginationProps };
