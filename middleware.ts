import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/"]; // Add other protected routes here

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // Exclude public routes like /login and /signup
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup"
  ) {
    return NextResponse.next();
  }

  // Exclude static files, API routes, and server actions
  if (
    request.nextUrl.pathname.startsWith("/_next/") || // Next.js static files
    request.nextUrl.pathname.startsWith("/static/") || // Custom static files
    request.nextUrl.pathname.startsWith("/favicon.ico") || // Favicon
    request.nextUrl.pathname.startsWith("/api/") // API routes
  ) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
