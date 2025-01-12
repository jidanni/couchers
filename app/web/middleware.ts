import { NextRequest, NextResponse } from "next/server";

interface CustomRequestCookies {
  "couchers-sesh"?: string;
}

export function middleware(
  req: NextRequest & { cookies: CustomRequestCookies }
) {
  const { pathname } = req.nextUrl;

  // Handle session redirection for "/" to "/dashboard"
  if (req.cookies.get("couchers-sesh") && pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/dashboard`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
