import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthState {
	token: string | null
	isAuthenticated: boolean
	// Actions
	setToken: (token: string) => void
	clearToken: () => void
}

// ─── Auth Store ───────────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
	devtools(
		persist(
			(set) => ({
				token: null,
				isAuthenticated: false,
				setToken: (token) => set({ token, isAuthenticated: true }),
				clearToken: () => set({ token: null, isAuthenticated: false }),
			}),
			{
				name: 'auth-storage', // key di localStorage
			}
		),
		{ name: 'AuthStore' }
	)
)
