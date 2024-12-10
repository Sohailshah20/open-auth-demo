import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/session';

const auth_routes = ["/login", "/register"]
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const sess = await getSession()
  const pathName = request.nextUrl.pathname
  if (!sess && !auth_routes.includes(pathName)) {
    return Response.redirect("http://localhost:3000/password/authorize")
  }

  return NextResponse.redirect(new URL('/home', request.url))
}
