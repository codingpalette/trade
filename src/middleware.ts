import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log("middleware user", user);
  // if user is not signed in redirect the user to /auth/login
  // if (!user) {
  //   return NextResponse.redirect(new URL('/auth/login', req.url))
  // }
  // return res;
}

export const config = {
  matcher: ["/", "/welcome", "/login"],
};
