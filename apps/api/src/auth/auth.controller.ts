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
    // Return Result directly - interceptor will handle errors
    return this.kratosService.createRegistrationFlow();
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Query('flow') flowId: string,
    @Body(new ZodValidationPipe(registerUserSchema)) userData: RegisterUserDto,
  ) {
    let actualFlowId = flowId;

    if (!actualFlowId) {
      // If no flowId, create a new one
      const flowResult = await this.kratosService.createRegistrationFlow();
      if (!flowResult.success) {
        return flowResult;
      }
      actualFlowId = flowResult.value.id;
    }

    // Return Result directly - interceptor will handle errors
    return this.kratosService.registerUser(actualFlowId, userData);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(new ZodValidationPipe(registerUserSchema)) userData: RegisterUserDto,
  ) {
    // Return Result directly - interceptor will handle errors
    return this.kratosService.createIdentity(userData);
  }

  @Get('users')
  async listUsers(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    // Return Result directly - interceptor will handle errors
    return this.kratosService.listIdentities(pageSize, pageToken);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    // Return Result directly - interceptor will handle errors
    return this.kratosService.getIdentity(id);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() credentials: { email: string; password: string }) {
    // Return Result directly - interceptor will handle errors
    return this.kratosService.verifyCredentials(
      credentials.email,
      credentials.password,
    );
  }
}
