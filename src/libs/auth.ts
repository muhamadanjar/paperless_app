import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@/utils/db'
import { getEnv } from './get-env'

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: DrizzleAdapter(db),
	providers: [
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const { email, password } = credentials as { email: string; password: string }

				const res = await fetch(`${getEnv('API_URL')}/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ email, password }),
				})

				const data = await res.json()

				if (res.status === 401) {
					throw new Error(JSON.stringify(data))
				}

				if (res.status === 200) {
					/*
					 * Please unset all the sensitive information of the user either from API response or before returning
					 * user data below. Below return statement will set the user object in the token and the same is set in
					 * the session which will be accessible all over the app.
					 */
					return data
				}

				return null
			},
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // ** 30 days
	},
})