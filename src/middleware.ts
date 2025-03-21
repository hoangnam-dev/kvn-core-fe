import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const publicPaths = ['/signin', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    if (publicPaths.includes(pathname) || pathname.startsWith('/images/')) {
        return NextResponse.next();
    }
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
        return redirectToSignIn(request, pathname);
    }

    try {
        const decoded = decodeJwt(token);

        if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
            return redirectToSignIn(request, pathname);
        }

        return NextResponse.next();
    } catch {
        return redirectToSignIn(request, pathname);
    }
}

function redirectToSignIn(request: NextRequest, pathname: string) {
    const signinUrl = new URL('/signin', request.url);
    signinUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signinUrl);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/|\\.).*)',
    ],
};
