
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Dashboard
    "/admin/:path*",
    "/vendor/:path*",
    "/customer/:path*",

    // Private Service Details
    "/browse-services/:id",

    // Profile Settings
    "/profile/:path*",

    // Payment
    "/payment-success",
    "/payment-cancel",
  ],
};
