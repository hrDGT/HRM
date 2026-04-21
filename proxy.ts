import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "de", "ru"],
  defaultLocale: "en",
  localePrefix: "never",
  localeDetection: true,
});

const PUBLIC_ROUTES = ["/auth/login"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;

  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!accessToken && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (accessToken && isPublic) {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_vercel|api|.*\\..*).*)",
  ],
};
