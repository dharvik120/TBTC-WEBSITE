import * as jose from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'stbt_secret_key_12345_industrial_portal';
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'stbt_session';

export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  permissions?: {
    canEditSettings: boolean;
    canEditProducts: boolean;
    canEditDownloads: boolean;
    canEditBlogs: boolean;
    canEditForms: boolean;
    canEditCustomPages: boolean;
  };
}

export async function encrypt(payload: JWTPayload) {
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);
}

export async function decrypt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await decrypt(token);
}

export async function setSession(user: { id: string; username: string; role: string }) {
  let permissions = {
    canEditSettings: true,
    canEditProducts: true,
    canEditDownloads: true,
    canEditBlogs: true,
    canEditForms: true,
    canEditCustomPages: true
  };

  if (user.role !== "SUPER_ADMIN") {
    const roleConfig = await prisma.roleConfig.findUnique({
      where: { role: user.role }
    });
    if (roleConfig) {
      permissions = {
        canEditSettings: roleConfig.canEditSettings,
        canEditProducts: roleConfig.canEditProducts,
        canEditDownloads: roleConfig.canEditDownloads,
        canEditBlogs: roleConfig.canEditBlogs,
        canEditForms: roleConfig.canEditForms,
        canEditCustomPages: roleConfig.canEditCustomPages
      };
    } else {
      permissions = {
        canEditSettings: false,
        canEditProducts: true,
        canEditDownloads: true,
        canEditBlogs: true,
        canEditForms: false,
        canEditCustomPages: false
      };
    }
  }

  const session = await encrypt({ 
    userId: user.id, 
    username: user.username, 
    role: user.role,
    permissions 
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
