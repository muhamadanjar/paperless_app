"use client"
import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLayoutStore } from '@/stores/layoutStore';
import { buildTheme } from './theme';
import { ThemeToggleContext } from '@/context/ThemeToggle';


export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
	const darkMode = useLayoutStore((s) => s.darkMode);
	const toggleDark = useLayoutStore((s) => s.toggleDark);
	
	const colorMode = React.useMemo(
		() => ({
			toggleColorMode: toggleDark,
		}),
		[toggleDark],
	);

	const theme = React.useMemo(
		() => buildTheme(darkMode),
		[darkMode],
	);

	return (
		<ThemeToggleContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ThemeToggleContext.Provider>
	);
}
