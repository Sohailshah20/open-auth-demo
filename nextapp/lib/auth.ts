import { createClient } from "@openauthjs/openauth";
import { subjects } from "./subjects";
import { cookies } from "next/headers";

export const authClient = createClient({
  issuer: "http://localhost:3000",
  clientID: "12345"

});

export async function setTokens(code: string) {
  const cookie = await cookies()
  const tokens = await authClient.exchange(
    code,
    `http://localhost:4000/callback`
  );
  cookie.set('access_token', tokens.access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  cookie.set('refresh_token', tokens.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
}

export async function validateSession() {
  const cookie = await cookies()
  const accessToken = cookie.get('access_token')?.value;
  const refreshToken = cookie.get('refresh_token')?.value;
  if (!accessToken || !refreshToken) return null;

  try {
    const verified = await authClient.verify(
      subjects,
      accessToken!,
      { refresh: refreshToken }
    );

    return verified.subject;
  } catch {
    return null;
  }
}
