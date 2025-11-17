import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { KratosService } from '../kratos/kratos.service';
import { registerUserSchema } from '@repo/api/dtos/user.dto';
import type { RegisterUserDto } from '@repo/api/dtos/user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly kratosService: KratosService) {}

  @Get('registration/init')
  async initRegistration() {
    const flow = await this.kratosService.createRegistrationFlow();
    return {
      flowId: flow.id,
      ui: flow.ui,
      expiresAt: flow.expires_at,
    };
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Query('flow') flowId: string,
    @Body(new ZodValidationPipe(registerUserSchema)) userData: RegisterUserDto,
  ) {
    if (!flowId) {
      // Si no hay flowId, crear uno nuevo
      const flow = await this.kratosService.createRegistrationFlow();
      flowId = flow.id;
    }

    const result = await this.kratosService.registerUser(flowId, userData);

    return {
      success: true,
      identity: result.identity,
      session: result.session,
    };
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(new ZodValidationPipe(registerUserSchema)) userData: RegisterUserDto,
  ) {
    const identity = await this.kratosService.createIdentity(userData);

    return {
      success: true,
      identity,
    };
  }

  @Get('users')
  async listUsers(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    return await this.kratosService.listIdentities(pageSize, pageToken);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return await this.kratosService.getIdentity(id);
  }
}
