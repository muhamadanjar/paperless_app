"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosServices } from '@/libs/http';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  Stack,
  IconButton,
  Button,
  Chip,
  Skeleton,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowLeft,
  Mail,
  User as UserIcon,
  Shield,
  Calendar,
  Settings,
  Edit,
  MoreVertical,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  image?: string;
}

export const UserDetail = ({ id }: { id: string }) => {
  const router = useRouter();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await axiosServices.get(`/api/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Error loading user details
        </Typography>
        <Button startIcon={<ArrowLeft />} onClick={() => router.back()} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Header / Breadcrumbs */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
            <MuiLink
              component={Link}
              underline="hover"
              color="inherit"
              href="/users"
              sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}
            >
              Users
            </MuiLink>
            <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
              User Profile
            </Typography>
          </Breadcrumbs>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Profile Details
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.back()}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            disableElevation
            startIcon={<Edit size={18} />}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
          >
            Edit Profile
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Column - Summary Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 5,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: 'background.paper',
              position: 'relative'
            }}
          >
            <Avatar
              src={user.image}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                fontSize: 48,
                bgcolor: 'primary.main',
                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.15)'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {user.email}
            </Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 800,
                fontSize: '0.65rem',
                bgcolor: 'action.hover',
                px: 1
              }}
            />
            
            <Divider sx={{ my: 4 }} />

            <Stack spacing={2.5} sx={{ textAlign: 'left' }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Contact Information
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'primary.lighter', color: 'primary.main' }}>
                    <Mail size={16} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.email}</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Account Status
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ 
                      p: 1, 
                      borderRadius: 1.5, 
                      bgcolor: user.status === 'active' ? 'success.lighter' : 'warning.lighter', 
                      color: user.status === 'active' ? 'success.main' : 'warning.main' 
                  }}>
                    <Shield size={16} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>{user.status}</Typography>
                </Stack>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', display: 'block', mb: 1 }}>
                  Joined Date
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: 'secondary.lighter', color: 'secondary.main' }}>
                    <Calendar size={16} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Tabs/Detailed Info */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: 5,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ px: 4, py: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem' }}>General Information</Typography>
               <IconButton size="small"><Settings size={18} /></IconButton>
            </Box>
            <Box sx={{ p: 4 }}>
               <Grid container spacing={4}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Full Name</Typography>
                     <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{user.name}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Email Address</Typography>
                     <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>{user.email}</Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Account Role</Typography>
                     <Box sx={{ mt: 0.5 }}>
                        <Chip label={user.role} size="small" color="primary" sx={{ fontWeight: 600, borderRadius: 1 }} />
                     </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                     <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>Member ID</Typography>
                     <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', p: 0.5, borderRadius: 1, mt: 0.5, display: 'inline-block' }}>
                        {user.id}
                     </Typography>
                  </Grid>
               </Grid>

               <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

               <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, fontSize: '1.1rem' }}>Security Settings</Typography>
                  <Stack spacing={2}>
                     <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                           <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Two-Factor Authentication</Typography>
                           <Typography variant="body2" color="text.secondary">Enhanced security with a secondary verification method.</Typography>
                        </Box>
                        <Button variant="text" size="small" sx={{ fontWeight: 700 }}>Enable</Button>
                     </Box>
                     <Box sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                           <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Login Sessions</Typography>
                           <Typography variant="body2" color="text.secondary">Currently active on 2 devices.</Typography>
                        </Box>
                        <Button variant="text" size="small" sx={{ fontWeight: 700 }}>Review</Button>
                     </Box>
                  </Stack>
               </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
