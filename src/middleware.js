import { getUserFromToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(req) {
  const cookiesList = await cookies();
  const token = cookiesList.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard");

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  // Handle admin routes - only allow admin users
  if (isAdminRoute) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const payload = await getUserFromToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", req.url));

    // Check if user is admin
    if (!payload.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    return response;
  }

  // Handle protected routes (non-admin)
  if (isProtectedRoute) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    const payload = await getUserFromToken(token);
    if (!payload) return NextResponse.redirect(new URL("/login", req.url));

    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.id);
    return response;
  }

  // Prevent logged-in users from visiting login/register
  if (isAuthPage && token) {
    const payload = await getUserFromToken(token);
    if (payload) {
      // Redirect admin users to admin dashboard, regular users to regular dashboard
      if (payload.isAdmin) {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}
