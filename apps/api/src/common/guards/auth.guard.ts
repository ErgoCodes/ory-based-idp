import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../services/jwt.service';

/**
 * Authentication Guard
 *
 * This guard protects endpoints by requiring a valid session token.
 * For now, it's a simple implementation that checks for an Authorization header.
 *
 * In production, you should:
 * - Validate JWT tokens
 * - Check token expiration
 * - Verify user permissions
 * - Use a proper session store (Redis, etc.)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is marked as public
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException({
        error: 'unauthorized',
        error_description: 'Authentication required',
        error_hint: 'Please provide a valid authorization token',
      });
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '');

    // Validate and decode the JWT token
    const payload = this.jwtService.verifyToken(token);

    if (!payload) {
      throw new UnauthorizedException({
        error: 'invalid_token',
        error_description: 'Invalid or expired token',
        error_hint: 'Please login again to get a new token',
      });
    }

    // Attach user info (including role) to the request object
    request.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    return true;
  }
}
