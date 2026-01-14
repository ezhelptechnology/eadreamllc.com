import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Protect /admin routes (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        if (!req.auth) {
            const loginUrl = new URL('/admin/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Redirect to /admin if already logged in and trying to access /admin/login
    if (pathname === '/admin/login' && req.auth) {
        const adminUrl = new URL('/admin', req.url);
        return NextResponse.redirect(adminUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: ['/admin/:path*'],
};
