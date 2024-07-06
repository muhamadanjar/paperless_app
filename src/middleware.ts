import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
const HOME_PAGE_URL = '/dashboards'
export default withAuth(
	async function middleware(request: NextRequestWithAuth) {

		const pathname = request.nextUrl.pathname;
		const token = request.nextauth.token
		const guestRoutes = ['auth/login', 'forgot-password']
		const isUserLoggedIn = !!token
		const sharedRoutes = ['shared-route']
		const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))
		let redirectUrl = '/auth/login'

		if (!isUserLoggedIn && privateRoute) {
			let redirectUrl = '/login'

			if (!(pathname === '/')) {
				const searchParamsStr = new URLSearchParams({ redirectTo: pathname }).toString()

				redirectUrl += `?${searchParamsStr}`
			}
			console.log("dfd")

			return NextResponse.redirect(redirectUrl, request)
		}

		const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

		if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
			return NextResponse.redirect(redirectUrl, request)
		}

		if (pathname === '/') {
			return NextResponse.redirect(HOME_PAGE_URL, request)
		}

	},
	{
		callbacks: {
			authorized: () => {
				return true
			}
		}
	}
)

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|images|next.svg|vercel.svg).*)'
	],
}
