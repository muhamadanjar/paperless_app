"use client"

import React from 'react';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLayoutStore } from '@/stores/layout-store';

export function ThemeToggle() {
  const { darkMode, toggleDark } = useLayoutStore();

  return (
    <IconButton sx={{ ml: 1 }} onClick={toggleDark} color="inherit">
      {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}