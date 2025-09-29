'use server';

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(email) {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ email, expiresAt });

  const cookie = await cookies();
  cookie.set('session', session, {
    httpOnly: false,
    secure: true,
    expires: expiresAt,
    path: '/',
  });
}

export async function deleteSession() {
  cookies().delete('session');
}

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return false;
  }
}

export async function verifySession() {
  const cookie = await cookies();
  const value = cookie.get('session')?.value;
  const session = await decrypt(value);

  return session;
}
