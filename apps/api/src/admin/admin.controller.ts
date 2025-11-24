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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { KratosService } from '../kratos/kratos.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { UpdateUserSchema, type UpdateUserDto } from '@repo/api/dtos/user.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AuthGuard, RolesGuard)
@Roles('superadmin')
export class AdminController {
  constructor(private readonly kratosService: KratosService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users (superadmin only)' })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    description: 'Number of users per page',
  })
  @ApiQuery({
    name: 'pageToken',
    required: false,
    description: 'Pagination token',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  async listUsers(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    return this.kratosService.listIdentities(pageSize, pageToken);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID (superadmin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string) {
    return this.kratosService.getIdentity(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user (superadmin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    description: 'User update data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: {
          type: 'object',
          properties: {
            first: { type: 'string', example: 'John' },
            last: { type: 'string', example: 'Doe' },
          },
        },
        role: { type: 'string', enum: ['user', 'superadmin'], example: 'user' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto,
  ) {
    const identityResult = await this.kratosService.getIdentity(id);
    if (!identityResult.success) {
      return identityResult;
    }

    const identity = identityResult.value;

    const updatedTraits = {
      ...identity.traits,
      ...(dto.email && { email: dto.email }),
      ...(dto.name && { name: dto.name }),
      ...(dto.role && { role: dto.role }),
    };

    return this.kratosService.updateIdentity(id, updatedTraits);
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (superadmin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    return this.kratosService.deleteIdentity(id);
  }
}
