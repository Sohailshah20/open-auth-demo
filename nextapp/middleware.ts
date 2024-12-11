// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authClient } from './lib/auth';
import { subjects } from './lib/subjects';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Skip callback route
  if (pathname === '/callback') {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  try {
    const response = NextResponse.next();
    if (accessToken && refreshToken) {
      const verified = await authClient.verify(subjects, accessToken, { refresh: refreshToken });

      if (verified.tokens) {

        // Refresh tokens
        response.cookies.set('access_token', verified.tokens.access, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        response.cookies.set('refresh_token', verified.tokens.refresh, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

      }
      const email = verified.subject.properties.email;
      response.cookies.set('user_email', email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
    return response;
  } catch (error) {
    console.error('Authentication failed:', error);
  }

  // Redirect to authorization if tokens are invalid or missing
  const redirectUrl = await authClient.authorize(`${origin}/callback`, 'code');
  return NextResponse.redirect(redirectUrl, 302);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|callback|login).*)',
    '/callback',
  ],
};