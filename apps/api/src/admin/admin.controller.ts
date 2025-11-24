import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { KratosService } from '../kratos/kratos.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UpdateUserSchema, type UpdateUserDto } from '@repo/api/dtos/user.dto';
import { ResultUtils } from '../common/result';

@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminController {
  constructor(private readonly kratosService: KratosService) {}

  @Get('users')
  async listUsers(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    // Fetch all identities from Kratos
    return this.kratosService.listIdentities(pageSize, pageToken);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    // Fetch specific identity from Kratos
    return this.kratosService.getIdentity(id);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
  ) {
    // Get current identity
    const identityResult = await this.kratosService.getIdentity(id);
    if (!identityResult.success) {
      return identityResult;
    }

    const identity = identityResult.value;

    // Update traits including role (superadmin can change roles)
    const updatedTraits = {
      ...identity.traits,
      ...(dto.email && { email: dto.email }),
      ...(dto.name && { name: dto.name }),
      ...(dto.role && { role: dto.role }),
    };

    // Update identity in Kratos
    return this.kratosService.updateIdentity(id, updatedTraits);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    // Delete identity from Kratos
    return this.kratosService.deleteIdentity(id);
  }
}
