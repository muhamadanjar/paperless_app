import { NextResponse } from 'next/server'
import { auth } from '@/libs/auth'

const HOME_PAGE_URL = '/dashboards'

export default auth(function middleware(request) {
	const pathname = request.nextUrl.pathname
	const token = request.auth
	const guestRoutes = ['auth/login', 'forgot-password']
	const isUserLoggedIn = !!token
	const sharedRoutes = ['shared-route']
	const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))

	if (!isUserLoggedIn && privateRoute) {
		let redirectUrl = '/auth/login'

		if (!(pathname === '/')) {
			const searchParamsStr = new URLSearchParams({ redirectTo: pathname }).toString()
			redirectUrl += `?${searchParamsStr}`
		}

		return NextResponse.redirect(new URL(redirectUrl, request.url))
	}

	const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

	if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
		return NextResponse.redirect(new URL(HOME_PAGE_URL, request.url))
	}

	if (pathname === '/') {
		return NextResponse.redirect(new URL(HOME_PAGE_URL, request.url))
	}
})

// See "Matching Paths" below to learn more
export const config = {
	matcher: [
		// '/((?!api|_next/static|_next/image|favicon.ico|images|next.svg|vercel.svg).*)'
	],
}
