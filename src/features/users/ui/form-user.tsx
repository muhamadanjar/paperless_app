import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  TextField,
  Stack,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  role: z.string().min(1, 'Role is required'),
  status: z.string().optional().default('active'),
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'user',
      status: initialData?.status || 'active',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Full Name"
          placeholder="e.g. John Doe"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />

        <TextField
          fullWidth
          label="Email Address"
          placeholder="e.g. john@example.com"
          type="email"
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        />

        <TextField
          select
          fullWidth
          label="Role"
          {...register('role')}
          error={!!errors.role}
          helperText={errors.role?.message}
          defaultValue={initialData?.role || 'user'}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>

        <TextField
          select
          fullWidth
          label="Status"
          {...register('status')}
          error={!!errors.status}
          helperText={errors.status?.message}
          defaultValue={initialData?.status || 'active'}
          slotProps={{
            inputLabel: { shrink: true }
          }}
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
        </TextField>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{ borderRadius: 2, px: 3, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={isLoading}
            sx={{ borderRadius: 2, px: 4, textTransform: 'none', fontWeight: 600 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : initialData ? 'Save Changes' : 'Create User'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
