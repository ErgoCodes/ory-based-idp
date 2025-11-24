import { Injectable } from '@nestjs/common';
import { sign, verify, decode, SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'superadmin';
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  /**
   * Generate a JWT token for a user
   */
  generateToken(
    userId: string,
    email: string,
    role: 'user' | 'superadmin',
  ): string {
    const payload: JwtPayload = {
      userId,
      email,
      role,
    };

    return sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Decode a token without verification (for debugging)
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return decode(token) as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
