import { AppBar, Toolbar, Typography } from '@mui/material'
import React from 'react'

export default function Navbar() {
  return (
    <AppBar position='sticky' elevation={0}>
      <Toolbar>
        <Typography variant="h6">Paperless</Typography>
      </Toolbar>
    </AppBar>
  )
}
