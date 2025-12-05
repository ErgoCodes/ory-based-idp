import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Logger,
  Res,
  Req,
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
import {
  registerUserSchema,
  sendEmailSchema,
  verifyEmailSchema,
} from '@repo/api/dtos/user.dto';
import type {
  RegisterUserDto,
  SendEmailDto,
  verifyEmailDto,
} from '@repo/api/dtos/user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { Public } from '../common/decorators/public.decorator';
import { ResultUtils } from '../common/result';
import { Response, Request } from 'express';

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
    // return this.kratosService.registerUser(actualFlowId, userData);

    const registrationResult = await this.kratosService.registerUser(
      actualFlowId,
      userData,
    );

    return registrationResult;
  }

  @Public()
  @Post('send-verif-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send account verification email' })
  @ApiBody({
    description: 'Email data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        value: {
          type: 'object',
          properties: {
            flowId: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid email' })
  async send_verification_email(
    @Body(new ZodValidationPipe(sendEmailSchema)) emailData: SendEmailDto,
  ) {
    const emailResult = await this.kratosService.startVerification(
      emailData.email,
    );

    if (!emailResult.success) {
      console.error('[send_verification_email] Failed:', emailResult.error);
      return emailResult;
    }

    console.log(
      '[send_verification_email] Success, flowId:',
      emailResult.value.flowId,
    );
    return emailResult;
  }

  @Public()
  @Post('complete-email-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete email verification' })
  @ApiBody({
    description: 'Data required to complete the email verification process',
    schema: {
      type: 'object',
      properties: {
        flowId: {
          type: 'string',
          example: 'e3e6acd2-5964-413d-a1bb-1e5a9880020a',
          description:
            'The verification flow ID returned when the email was sent',
        },
        code: {
          type: 'string',
          example: '552550',
          description: 'The verification code received by the user via email',
        },
      },
      required: ['flowId', 'code'],
    },
  })
  @ApiResponse({
    status: 200,
    description:
      "Email verification completed successfully. The user's email is now marked as verified.",
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data or the verification code/flow has expired.',
  })
  @ApiResponse({
    status: 404,
    description: 'Verification flow not found.',
  })
  async complete_email_verification(
    @Body(new ZodValidationPipe(verifyEmailSchema)) data: verifyEmailDto,
  ) {
    const result = await this.kratosService.endVerification(
      data.flowId,
      data.code,
    );
    if (!result.success) {
      console.log(result);
      return result;
    }

    return result;
  }

  /**
   * Start password recovery flow
   */
  @Public()
  @Post('recovery/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start password recovery flow' })
  async startRecovery(@Body('email') email: string) {
    console.log('[Controller] Starting recovery for:', email);
    const result = await this.kratosService.startRecovery(email);

    if (!result.success) {
      console.error('[Controller] Recovery start failed:', result.error);
      return result;
    }

    console.log('[Controller] Recovery flow started:', result.value.flowId);
    return result;
  }

  @Public()
  @Post('recovery/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete recovery with code' })
  async completeRecoveryWithCode(
    @Body('flowId') flowId: string,
    @Body('code') code: string,
    @Res() res: Response,
  ) {
    console.log(
      '[Controller] Completing recovery. Flow:',
      flowId,
      'Code:',
      code,
    );
    const result = await this.kratosService.completeRecoveryWithCode(
      flowId,
      code,
    );

    if (!result.success) {
      console.error('[Controller] Recovery completion failed:', result.error);
      return result;
    }

    console.log('[Controller] Recovery completed successfully');
    const continueWithToken = result.value.continueWith?.find(
      (c) => c.action === 'set_ory_session_token',
    );

    if (!continueWithToken || !('ory_session_token' in continueWithToken)) {
      return res.status(400).json({ error: 'No session token returned' });
    }

    const token = continueWithToken.ory_session_token;
    console.log(token);
    res.cookie('ory_session_token', token, {
      httpOnly: true, // not accessible via JS
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15, // 15 minutes
    });
    return res.json({ message: 'Recovery completed, session cookie set' });
  }

  @Public()
  @Post('settings/flow/create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a native settings flow' })
  async createSettingsFlow(@Req() req: Request, @Res() res: Response) {
    // Read the token from the cookie
    const token = req.cookies['ory_session_token'];
    console.log('[Controller] Creating settings flow with token:', token);

    if (!token) {
      return res
        .status(401)
        .json({ error: 'No session token found in cookies' });
    }

    const result = await this.kratosService.createSettingsFlow(token);

    if (!result.success) {
      console.error(
        '[Controller] Settings flow creation failed:',
        result.error,
      );
      return res.status(400).json(result);
    }

    console.log(
      '[Controller] Settings flow created successfully:',
      result.value.flowId,
    );

    // Return the flowId so the frontend can redirect to /settings?flow=<flowId>
    return res.json({ flowId: result.value.flowId });
  }

  @Public()
  @Post('settings/flow/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete settings flow and change password' })
  async completeSettingsFlow(
    @Body('flowId') flowId: string,
    @Body('password') password: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['ory_session_token'];
    console.log('[Controller] Completing settings flow with flowId:', flowId);

    if (!token) {
      return res
        .status(401)
        .json({ error: 'No session token found in cookies' });
    }

    const result = await this.kratosService.completeSettingsFlow(
      flowId,
      password,
      token,
    );

    if (!result.success) {
      console.error(
        '[Controller] Settings flow completion failed:',
        result.error,
      );
      return res.status(400).json(result);
    }

    console.log('[Controller] Settings flow completed successfully');
    return res.json({ success: true });
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
      console.log(result);
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
