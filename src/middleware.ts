import { NextRequest, NextResponse } from 'next/server'
import { getUrl } from './lib/get-url'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('next-auth.session-token')
    const pathname = request.nextUrl.pathname
    console.log(`token: ${token}`)
    if (pathname === '/auth' && token) {
        return NextResponse.redirect(new URL(getUrl('/client')))
    }

    if (pathname.includes('/client') && !token) {
        return NextResponse.redirect(new URL(getUrl('/auth')))
    }

}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}