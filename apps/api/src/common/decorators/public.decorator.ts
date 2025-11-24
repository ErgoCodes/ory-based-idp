import { SetMetadata } from '@nestjs/common';

/**
 * Public decorator
 *
 * Use this decorator to mark routes that don't require authentication.
 * Example:
 *
 * @Public()
 * @Post('login')
 * async login() { ... }
 */
export const Public = () => SetMetadata('isPublic', true);
