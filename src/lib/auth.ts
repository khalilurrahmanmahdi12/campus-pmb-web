import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-campus-pmb-2025';

export interface AdminPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export function getAdminFromRequest(request: NextRequest): AdminPayload | null {
  // Check cookie first
  const cookieToken = request.cookies.get('admin_token')?.value;
  if (cookieToken) {
    const verified = verifyAdminToken(cookieToken);
    if (verified) return verified;
  }

  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const headerToken = authHeader.substring(7);
    return verifyAdminToken(headerToken);
  }

  return null;
}
