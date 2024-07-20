import type { NextAuthOptions } from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import CredentialProvider from 'next-auth/providers/credentials'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
	adapter: PrismaAdapter(prisma) as Adapter,
	providers: [
		CredentialProvider({
			name: "Crendential",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any, req) {
				const { email, password } = credentials as { email: string; password: string }
				const res = await fetch(`${process.env.API_URL}/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ email, password })
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
		strategy: "jwt", 
		maxAge: 30 * 24 * 60 * 60 // ** 30 days 
	},
}