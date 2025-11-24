import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { KratosService } from '../kratos/kratos.service';
import { JwtService } from '../common/services/jwt.service';
import { registerUserSchema } from '@repo/api/dtos/user.dto';
import type { RegisterUserDto } from '@repo/api/dtos/user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Public } from '../common/decorators/public.decorator';
import { ResultUtils } from '../common/result';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly kratosService: KratosService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Get('registration/init')
  @ApiOperation({ summary: 'Initialize registration flow' })
  @ApiResponse({
    status: 200,
    description: 'Registration flow created successfully',
  })
  async initRegistration() {
    return this.kratosService.createRegistrationFlow();
  }

  @Public()
  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiQuery({
    name: 'flow',
    required: false,
    description: 'Registration flow ID',
  })
  @ApiBody({
    description: 'User registration data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'SecurePass123!' },
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
      },
      required: ['email', 'password', 'firstName', 'lastName'],
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
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

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    description: 'Login credentials',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        value: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'user-uuid' },
                email: { type: 'string', example: 'user@example.com' },
                role: { type: 'string', example: 'user' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() credentials: { email: string; password: string }) {
    // Verify credentials
    const result = await this.kratosService.verifyCredentials(
      credentials.email,
      credentials.password,
    );

    // If verification failed, return the error
    if (!result.success) {
      return result;
    }

    // Generate JWT token with role
    const identity = result.value;
    const accessToken = this.jwtService.generateToken(
      identity.id,
      identity.traits.email,
      identity.traits.role,
    );

    // Return user data with access token
    return ResultUtils.ok({
      user: identity,
      access_token: accessToken,
    });
  }
}
