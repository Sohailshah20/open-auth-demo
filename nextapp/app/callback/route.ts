// app/callback/route.ts
import { setTokens } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  try {
    await setTokens(code!)
    const redirectUrl = new URL('/', request.nextUrl.origin); // Use origin to resolve '/'
    return NextResponse.redirect(redirectUrl, 302);
  } catch (e) {
    return NextResponse.json(e, { status: 400 });
  }
}