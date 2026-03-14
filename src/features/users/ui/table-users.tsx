"use client"
import { ColumnDef, ColumnOrderState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Icon from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { DataGrid, DataGridApiFetchParams, DataGridApiResponse } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Paper, Typography } from "@mui/material";
import { axiosServices } from "@/libs/http";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const UserList = () => {
    const [pagination, setPagination] = useState({
        pageSize: 10,
        pageIndex: 0,
    });

    const [sorting, setSorting] = useState<SortingState>([
        { id: 'createdAt', desc: true },
    ]);
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

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
        ...(selectedRole && selectedRole !== 'all'
            ? { roleId: selectedRole }
            : {}),
        ...(selectedStatus && selectedStatus !== 'all'
            ? { status: selectedStatus }
            : {}),
        });

        const response = await axiosServices.get(
            `/api/users?${params.toString()}`,
        );

        return response.data;
    };


    const { data, isLoading } = useQuery({
        queryKey: [
        'user-users',
        pagination,
        sorting,
        searchQuery,
        selectedRole,
        selectedStatus,
        ],
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



    
    const columns = useMemo<ColumnDef<User>[]>(() => {
        return [
            {
                accessorKey: "name",
                header: "Name",
            },
            {
                accessorKey: "email",
                header: "Email",
            },
            {
                accessorKey: "role",
                header: "Role",
            },
            {
                accessorKey: 'actions',
                header: '',
                cell: () => (
                    <Icon name="chevron-right" className="text-muted-foreground/70 size-3.5" />
                ),
                meta: {
                    skeleton: <Skeleton className="size-4" />,
                },
                size: 40,
                enableSorting: false,
                enableHiding: false,
                enableResizing: false,

            }
        ];
    }, []);

    const table = useReactTable({
        columns,
        data: data?.data || [],
        pageCount: Math.ceil((data?.pagination.total || 0) / pagination.pageSize),
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
        <Paper className="overflow-hidden rounded">
            <Box className="px-4 pt-4 pb-0 border-b border-white/5">
                <Box className="flex items-center justify-between">
                    <Box>
                        <Typography variant="h6">Users</Typography>
                        <Typography variant="body2">Manage user accounts and permissions</Typography>
                    </Box>
                    <Box>
                        <Button variant="contained" color="primary">Add User</Button>
                    </Box>
                </Box>
            </Box>
            <DataGrid table={table} recordCount={0}
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
                <DataGridTable/>
                <DataGridPagination/>
            </DataGrid>
        </Paper>
    );
}