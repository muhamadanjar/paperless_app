"use client"
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLayoutStore } from '@/stores/layout-store';
import { buildTheme } from '@/libs/theme';
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	const darkMode = useLayoutStore((s) => s.darkMode);

	const theme = React.useMemo(
		() => buildTheme(darkMode),
		[darkMode],
	);

	return (
		<ThemeProvider theme={theme}>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
