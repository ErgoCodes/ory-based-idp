import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { KratosService } from '../kratos/kratos.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  UpdateProfileSchema,
  ChangePasswordSchema,
  type UpdateProfileDto,
  type ChangePasswordDto,
} from '@repo/api/dtos/user.dto';
import { ResultUtils } from '../common/result';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly kratosService: KratosService) {}

  @Get('me')
  @Roles('user', 'superadmin')
  async getProfile(@Request() req) {
    const userId = req.user.userId;

    // Fetch identity from Kratos
    const result = await this.kratosService.getIdentity(userId);

    if (!result.success) {
      return result;
    }

    // Return profile including role
    return ResultUtils.ok(result.value);
  }

  @Patch('me')
  @Roles('user', 'superadmin')
  async updateProfile(
    @Request() req,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) dto: UpdateProfileDto,
  ) {
    const userId = req.user.userId;

    // Get current identity
    const identityResult = await this.kratosService.getIdentity(userId);
    if (!identityResult.success) {
      return identityResult;
    }

    const identity = identityResult.value;

    // Update traits (but not role - users cannot change their own role)
    const updatedTraits = {
      ...identity.traits,
      ...(dto.email && { email: dto.email }),
      ...(dto.name && { name: dto.name }),
    };

    // Update identity in Kratos
    return this.kratosService.updateIdentity(userId, updatedTraits);
  }

  @Post('me/password')
  @Roles('user', 'superadmin')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body(new ZodValidationPipe(ChangePasswordSchema)) dto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    const email = req.user.email;

    // Verify current password
    const verifyResult = await this.kratosService.verifyCredentials(
      email,
      dto.currentPassword,
    );

    if (!verifyResult.success) {
      return ResultUtils.err({
        code: 'invalid_password',
        message: 'Current password is incorrect',
        statusCode: 401,
      });
    }

    // Update password in Kratos
    return this.kratosService.updatePassword(userId, dto.newPassword);
  }
}
