import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HydraService } from './hydra.service';
import { KratosService } from '../kratos/kratos.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  LoginRequestSchema,
  LoginRequest,
  LoginCredentials,
  SkipLogin,
  ConsentDecisionSchema,
  ConsentDecision,
  CreateOAuth2ClientSchema,
  CreateOAuth2Client,
} from '@repo/api';
import { ResponseMapper } from './mappers/response.mapper';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('oauth2')
export class HydraController {
  constructor(
    private readonly hydraService: HydraService,
    private readonly kratosService: KratosService,
  ) {}

  /**
   * GET /oauth2/login?login_challenge=xxx
   */
  @Public()
  @Get('login')
  async getLoginRequest(@Query('login_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'login_challenge parameter is required',
        error_hint: 'Please provide a valid login_challenge parameter',
      });
    }

    // Return Result directly - interceptor will handle errors
    return this.hydraService.getLoginRequest(challenge);
  }

  /**
   * POST /oauth2/login?login_challenge=xxx
   */
  @Public()
  @Post('login')
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
      return this.hydraService.acceptLoginRequest(challenge, {
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
      return this.hydraService.rejectLoginRequest(
        challenge,
        'invalid_credentials',
        'Invalid email or password',
      );
    }

    // Accept login with verified identity
    return this.hydraService.acceptLoginRequest(challenge, {
      subject: identityResult.value.id,
      remember: credentials.remember,
      remember_for: credentials.remember ? 3600 : undefined,
    });
  }

  /**
   * GET /oauth2/consent?consent_challenge=yyy
   */
  @Public()
  @Get('consent')
  async getConsentRequest(@Query('consent_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'consent_challenge parameter is required',
        error_hint: 'Please provide a valid consent_challenge parameter',
      });
    }

    return this.hydraService.getConsentRequest(challenge);
  }

  /**
   * POST /oauth2/consent?consent_challenge=yyy
   */
  @Public()
  @Post('consent')
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
      return this.hydraService.rejectConsentRequest(
        challenge,
        'access_denied',
        'The user denied the consent request',
      );
    }

    // Get consent request to retrieve requested scopes
    const consentRequestResult =
      await this.hydraService.getConsentRequest(challenge);

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

      console.log('Identity retrieved for consent:', {
        subject: consentRequest.subject,
        email: identity.traits.email,
        hasName: !!identity.traits.name,
        grantedScopes,
      });

      // Add email claims if 'email' scope is granted
      if (grantedScopes.includes('email')) {
        idTokenClaims.email = identity.traits.email;
        // Note: Kratos identity doesn't have verifiable_addresses in our schema
        // Set email_verified to true if the user has logged in successfully
        idTokenClaims.email_verified = true;
      }

      // Add profile claims if 'profile' scope is granted
      if (grantedScopes.includes('profile') && identity.traits.name) {
        // Build full name from first and last name
        const fullName = `${identity.traits.name.first} ${identity.traits.name.last}`;
        idTokenClaims.name = fullName;
        idTokenClaims.given_name = identity.traits.name.first;
        idTokenClaims.family_name = identity.traits.name.last;
      }
    } else {
      console.error('Failed to retrieve identity for consent:', {
        subject: consentRequest.subject,
        error: identityResult.error,
      });
    }

    console.log('ID token claims to be set:', idTokenClaims);

    // Accept consent
    return this.hydraService.acceptConsentRequest(challenge, {
      grant_scope: grantedScopes,
      grant_access_token_audience:
        consentRequest.requested_access_token_audience,
      remember: decision.remember,
      remember_for: decision.remember ? 3600 : undefined,
      session: {
        id_token: idTokenClaims,
        access_token: idTokenClaims, // Also add to access token for userinfo endpoint
      },
    });
  }

  /**
   * POST /oauth2/clients
   */
  @Post('clients')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  async createClient(
    @Body(new ZodValidationPipe(CreateOAuth2ClientSchema))
    clientData: CreateOAuth2Client,
  ) {
    const result = await this.hydraService.createOAuth2Client(clientData);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toOAuth2ClientCreationResponse(result.value),
    };
  }

  /**
   * GET /oauth2/clients
   */
  @Get('clients')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  async listClients(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    const result = await this.hydraService.listOAuth2Clients(
      pageSize,
      pageToken,
    );

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: result.value.map((client) =>
        ResponseMapper.toPublicOAuth2Client(client),
      ),
    };
  }

  /**
   * GET /oauth2/clients/:id
   */
  @Get('clients/:id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  async getClient(@Param('id') clientId: string) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.hydraService.getOAuth2Client(clientId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toPublicOAuth2Client(result.value),
    };
  }

  /**
   * PUT /oauth2/clients/:id
   */
  @Put('clients/:id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  async updateClient(
    @Param('id') clientId: string,
    @Body(new ZodValidationPipe(CreateOAuth2ClientSchema))
    clientData: CreateOAuth2Client,
  ) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.hydraService.updateOAuth2Client(
      clientId,
      clientData,
    );

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toOAuth2ClientCreationResponse(result.value),
    };
  }

  /**
   * DELETE /oauth2/clients/:id
   */
  @Delete('clients/:id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteClient(@Param('id') clientId: string) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.hydraService.deleteOAuth2Client(clientId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
    };
  }

  /**
   * GET /oauth2/logout?logout_challenge=zzz
   */
  @Public()
  @Get('logout')
  async getLogoutRequest(@Query('logout_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'logout_challenge parameter is required',
        error_hint: 'Please provide a valid logout_challenge parameter',
      });
    }

    return this.hydraService.getLogoutRequest(challenge);
  }

  /**
   * POST /oauth2/logout?logout_challenge=zzz
   */
  @Public()
  @Post('logout')
  async handleLogout(@Query('logout_challenge') challenge: string) {
    if (!challenge) {
      throw new BadRequestException({
        error: 'missing_challenge',
        error_description: 'logout_challenge parameter is required',
        error_hint: 'Please provide a valid logout_challenge parameter',
      });
    }

    // Accept the logout request
    return this.hydraService.acceptLogoutRequest(challenge);
  }
}
