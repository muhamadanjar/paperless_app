"use client"
import {
  ColumnDef,
  ColumnOrderState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Icon from '@/components/ui/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { DataGrid, DataGridApiFetchParams, DataGridApiResponse } from '@/components/ui/data-grid';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Zoom,
} from '@mui/material';
import { Search, UserPlus, RotateCcw, Download, Filter, X } from 'lucide-react';
import { axiosServices } from '@/libs/http';
import { UserForm, UserFormData } from './form-user';
import { toast } from 'react-toastify';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
}

export const UserList = () => {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageIndex: 0,
  });

  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async ({
    pageIndex,
    pageSize,
    sorting,
    searchQuery,
    selectedRole,
    selectedStatus,
  }: DataGridApiFetchParams & {
    selectedRole: string | null;
    selectedStatus: string | null;
  }): Promise<DataGridApiResponse<User>> => {
    const sortField = sorting?.[0]?.id || '';
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...(sortField ? { sort: sortField, dir: sortDirection } : {}),
      ...(searchQuery ? { query: searchQuery } : {}),
      ...(selectedRole && selectedRole !== 'all' ? { roleId: selectedRole } : {}),
      ...(selectedStatus && selectedStatus !== 'all' ? { status: selectedStatus } : {}),
    });

    const response = await axiosServices.get(`/api/users?${params.toString()}`);

    return response.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user-users', pagination, sorting, searchQuery, selectedRole, selectedStatus],
    queryFn: () =>
      fetchUsers({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        sorting,
        searchQuery,
        selectedRole,
        selectedStatus,
      }),
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  // Mutations
  const createUserMutation = useMutation({
    mutationFn: (newUser: UserFormData) => axiosServices.post('/api/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-users'] });
      toast.success('User created successfully');
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  });

  const handleOpenDialog = (user: User | null = null) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmitForm = (formData: UserFormData) => {
    if (editingUser) {
        // Implement update logic if endpoint exists
        toast.info('Update functionality would be called here');
        handleCloseDialog();
    } else {
        createUserMutation.mutate(formData);
    }
  };

  const columns = useMemo<ColumnDef<User>[]>(() => {
    return [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => (
           <Typography variant="body2" sx={{ fontWeight: 600 }}>{info.getValue() as string}</Typography>
        ),
        meta: {
            skeleton: <Skeleton className='h-4 w-full bg-gray-700'/>,
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        meta:{
            skeleton: <Skeleton className='h-7 w-28 bg-gray-700'/>
        }
      },
      {
        accessorKey: 'role',
        header: 'Role',
        cell: (info) => (
            <Box component="span" sx={{ 
                px: 1, 
                py: 0.25, 
                borderRadius: 1, 
                bgcolor: 'action.hover', 
                fontSize: '0.75rem', 
                fontWeight: 600,
                textTransform: 'capitalize'
            }}>
                {info.getValue() as string}
            </Box>
        ),
        meta:{
            headerTitle: "Role",
            skeleton: <Skeleton className='h-5 w-full bg-gray-700'/>,

        }
      },
      {
        accessorKey: 'actions',
        header: '',
        cell: (info) => (
          <Tooltip title="Edit User">
            <IconButton size="small" onClick={() => handleOpenDialog(info.row.original)}>
              <Icon name="edit-2" className="text-muted-foreground/70 size-4" />
            </IconButton>
          </Tooltip>
        ),
        meta: {
          skeleton: <Skeleton className="h-4 w-full bg-gray-700" />,
        },
        size: 40,
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
      },
    ];
  }, []);

  const table = useReactTable({
    columns,
    data: data?.data || [],
    pageCount: Math.ceil((data?.meta?.total || 0) / pagination.pageSize),
    getRowId: (row: User) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
      }}
    >
      {/* Header Toolbar */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, letterSpacing: '-0.02em' }}>
              User Directory
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Easily manage profiles, permissions, and roles within the system.
            </Typography>
          </Box>
          <Button
            variant="contained"
            disableElevation
            startIcon={<UserPlus size={18} />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              }
            }}
          >
            Create Member
          </Button>
        </Stack>
      </Box>

      {/* Filter Bar */}
      <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flexGrow: 1,
              minWidth: { md: 320 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'primary.main' },
              },
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                          <Search size={18} className="text-muted-foreground" />
                        </InputAdornment>
                      ),
                }
            }}
          />

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Select
              size="small"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
              sx={{
                minWidth: 150,
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Filter size={14} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">Every Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="user">User Member</MenuItem>
            </Select>

            <Select
              size="small"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              displayEmpty
              sx={{
                minWidth: 150,
                borderRadius: 2.5,
                bgcolor: 'background.paper',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <MenuItem value="all">Any Status</MenuItem>
              <MenuItem value="active">Active Now</MenuItem>
              <MenuItem value="inactive">Currently Offline</MenuItem>
              <MenuItem value="pending">Waiting Approval</MenuItem>
            </Select>

            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: 'center' }} />

            <Tooltip title="Refresh Directory">
              <IconButton
                size="small"
                onClick={() => refetch()}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  width: 36,
                  height: 36
                }}
              >
                <RotateCcw size={18} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Export CSV">
              <IconButton
                size="small"
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  width: 36,
                  height: 36
                }}
              >
                <Download size={18} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Main Grid */}
      <DataGrid
        table={table}
        recordCount={data?.meta?.total || 0}
        isLoading={isLoading}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
        tableClassNames={{
          edgeCell: 'px-5',
        }}
      >
        <DataGridTable />
        <DataGridPagination />
      </DataGrid>

      {/* Add/Edit Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Zoom}
        TransitionProps={{ timeout: 400 } as any}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {editingUser ? 'Edit System Member' : 'Add New Member'}
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small" sx={{ color: 'text.disabled' }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editingUser 
              ? 'Modify the details of the existing user. Some fields may be restricted.' 
              : 'Complete the form below to register a new member to the system.'}
          </Typography>
          <UserForm 
            initialData={editingUser || undefined} 
            onSubmit={handleSubmitForm} 
            onCancel={handleCloseDialog}
            isLoading={createUserMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
};