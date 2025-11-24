import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { OAuth2FlowService } from './oauth2-flow.service';
import { KratosService } from '../kratos/kratos.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  LoginRequestSchema,
  LoginRequest,
  LoginCredentials,
  SkipLogin,
  ConsentDecisionSchema,
  ConsentDecision,
} from '@repo/api';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('OAuth2 Flow')
@Controller('oauth2')
export class OAuth2FlowController {
  constructor(
    private readonly oauth2FlowService: OAuth2FlowService,
    private readonly kratosService: KratosService,
  ) {}

  @Public()
  @Get('login')
  @ApiOperation({ summary: 'Get OAuth2 login request' })
  @ApiQuery({
    name: 'login_challenge',
    description: 'Login challenge from Hydra',
  })
  @ApiResponse({
    status: 200,
    description: 'Login request retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid challenge' })
  async getLoginRequest(@Query('login_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'login_challenge parameter is required',
        error_hint: 'Please provide a valid login_challenge parameter',
      });
    }

    return this.oauth2FlowService.getLoginRequest(challenge);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Handle OAuth2 login' })
  @ApiQuery({
    name: 'login_challenge',
    description: 'Login challenge from Hydra',
  })
  @ApiBody({
    description: 'Login credentials or skip decision',
    schema: {
      oneOf: [
        {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
            remember: { type: 'boolean', example: true },
          },
          required: ['email', 'password'],
        },
        {
          type: 'object',
          properties: {
            skip: { type: 'boolean', example: true },
            subject: { type: 'string', example: 'user-uuid' },
          },
          required: ['skip', 'subject'],
        },
      ],
    },
  })
  @ApiResponse({ status: 200, description: 'Login handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async handleLogin(
    @Query('login_challenge') challenge: string,
    @Body(new ZodValidationPipe(LoginRequestSchema)) request: LoginRequest,
  ) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'login_challenge parameter is required',
        error_hint: 'Please provide a valid login_challenge parameter',
      });
    }

    // Check if this is a skip request
    if ('skip' in request && request.skip) {
      const skipRequest = request as SkipLogin;
      return this.oauth2FlowService.acceptLoginRequest(challenge, {
        subject: skipRequest.subject,
        remember: false,
      });
    }

    // Regular login with credentials
    const credentials = request as LoginCredentials;

    // Verify credentials
    const identityResult = await this.kratosService.verifyCredentials(
      credentials.email,
      credentials.password,
    );

    if (!identityResult.success) {
      // Reject login if credentials are invalid
      return this.oauth2FlowService.rejectLoginRequest(
        challenge,
        'invalid_credentials',
        'Invalid email or password',
      );
    }

    // Accept login with verified identity
    return this.oauth2FlowService.acceptLoginRequest(challenge, {
      subject: identityResult.value.id,
      remember: credentials.remember,
      remember_for: credentials.remember ? 3600 : undefined,
    });
  }

  @Public()
  @Get('consent')
  @ApiOperation({ summary: 'Get OAuth2 consent request' })
  @ApiQuery({
    name: 'consent_challenge',
    description: 'Consent challenge from Hydra',
  })
  @ApiResponse({
    status: 200,
    description: 'Consent request retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid challenge' })
  async getConsentRequest(@Query('consent_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'consent_challenge parameter is required',
        error_hint: 'Please provide a valid consent_challenge parameter',
      });
    }

    return this.oauth2FlowService.getConsentRequest(challenge);
  }

  @Public()
  @Post('consent')
  @ApiOperation({ summary: 'Handle OAuth2 consent' })
  @ApiQuery({
    name: 'consent_challenge',
    description: 'Consent challenge from Hydra',
  })
  @ApiBody({
    description: 'Consent decision',
    schema: {
      type: 'object',
      properties: {
        grant_scope: {
          type: 'array',
          items: { type: 'string' },
          example: ['openid', 'email', 'profile'],
        },
        remember: { type: 'boolean', example: true },
      },
      required: ['grant_scope'],
    },
  })
  @ApiResponse({ status: 200, description: 'Consent handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async handleConsent(
    @Query('consent_challenge') challenge: string,
    @Body(new ZodValidationPipe(ConsentDecisionSchema))
    decision: ConsentDecision,
  ) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'consent_challenge parameter is required',
        error_hint: 'Please provide a valid consent_challenge parameter',
      });
    }

    // If consent is denied
    if (!decision.grant) {
      return this.oauth2FlowService.rejectConsentRequest(
        challenge,
        'access_denied',
        'The user denied the consent request',
      );
    }

    // Get consent request to retrieve requested scopes
    const consentRequestResult =
      await this.oauth2FlowService.getConsentRequest(challenge);

    if (!consentRequestResult.success) {
      return consentRequestResult;
    }

    const consentRequest = consentRequestResult.value;
    const grantedScopes =
      decision.grant_scope || consentRequest.requested_scope;

    // Get user identity from Kratos to populate ID token claims
    const identityResult = await this.kratosService.getIdentity(
      consentRequest.subject,
    );

    // Build ID token claims based on granted scopes
    const idTokenClaims: Record<string, any> = {};

    if (identityResult.success) {
      const identity = identityResult.value;

      if (grantedScopes.includes('email')) {
        idTokenClaims.email = identity.traits.email;
        idTokenClaims.email_verified = true;
      }

      if (grantedScopes.includes('profile') && identity.traits.name) {
        const fullName = `${identity.traits.name.first} ${identity.traits.name.last}`;
        idTokenClaims.name = fullName;
        idTokenClaims.given_name = identity.traits.name.first;
        idTokenClaims.family_name = identity.traits.name.last;
      }
    }

    // Accept consent
    return this.oauth2FlowService.acceptConsentRequest(challenge, {
      grant_scope: grantedScopes,
      grant_access_token_audience:
        consentRequest.requested_access_token_audience,
      remember: decision.remember,
      remember_for: decision.remember ? 3600 : undefined,
      session: {
        id_token: idTokenClaims,
        access_token: idTokenClaims,
      },
    });
  }

  @Public()
  @Get('logout')
  @ApiOperation({ summary: 'Get OAuth2 logout request' })
  @ApiQuery({
    name: 'logout_challenge',
    description: 'Logout challenge from Hydra',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout request retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Missing or invalid challenge' })
  async getLogoutRequest(@Query('logout_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'logout_challenge parameter is required',
        error_hint: 'Please provide a valid logout_challenge parameter',
      });
    }

    return this.oauth2FlowService.getLogoutRequest(challenge);
  }

  @Public()
  @Post('logout')
  @ApiOperation({ summary: 'Handle OAuth2 logout' })
  @ApiQuery({
    name: 'logout_challenge',
    description: 'Logout challenge from Hydra',
  })
  @ApiResponse({ status: 200, description: 'Logout handled successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async handleLogout(@Query('logout_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'logout_challenge parameter is required',
        error_hint: 'Please provide a valid logout_challenge parameter',
      });
    }

    return this.oauth2FlowService.acceptLogoutRequest(challenge);
  }
}
