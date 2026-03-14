import { authConfig } from '@/configs/auth.config'
import NextAuth from 'next-auth';

export default NextAuth(authConfig).auth;

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		'/((?!auth|api/login|api/auth/.*|assets|fonts|media|_next/static|_next/image|.*\\.png$).*)',
	],
	runtime: 'nodejs',
	
}
