import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "de", "ru"],
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: true,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const isPublic = ["/auth/login", "/auth/signup", "/forgot-password", "/reset-password"].some(route => pathname.startsWith(route));

  if (!accessToken && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  const intlResponse = intlMiddleware(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-current-path", pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders }
  });

  intlResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, cookie);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_vercel|api|favicon.ico|.*\\..*).*)"],
};