import { Injectable } from '@nestjs/common';
import { OAuth2Api } from '@ory/client-fetch';
import {
  LoginRequestInfo,
  ConsentRequestInfo,
  AcceptLoginRequest,
  AcceptConsentRequest,
  RedirectResponse,
  CreateOAuth2Client,
  OAuth2Client,
} from '@repo/api';
import { Result, ResultUtils } from '../common/result';
import { HydraError, HydraErrorHandler } from './hydra-error.handler';
import { HydraMapper } from './mappers/hydra.mapper';

@Injectable()
export class HydraService {
  constructor(private readonly hydraAdmin: OAuth2Api) {}

  /**
   * Fetch login request details from Hydra
   */
  async getLoginRequest(
    challenge: string,
  ): Promise<Result<LoginRequestInfo, HydraError>> {
    try {
      const response = await this.hydraAdmin.getOAuth2LoginRequest({
        loginChallenge: challenge,
      });

      const loginRequest = HydraMapper.toLoginRequestInfo(challenge, response);
      return ResultUtils.ok(loginRequest);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'login_request',
        'Failed to fetch login request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Accept login request with user subject
   */
  async acceptLoginRequest(
    challenge: string,
    body: AcceptLoginRequest,
  ): Promise<Result<RedirectResponse, HydraError>> {
    try {
      const response = await this.hydraAdmin.acceptOAuth2LoginRequest({
        loginChallenge: challenge,
        acceptOAuth2LoginRequest: body,
      });

      return ResultUtils.ok({ redirect_to: response.redirect_to });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'accept_login',
        'Failed to accept login request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Reject login request
   */
  async rejectLoginRequest(
    challenge: string,
    errorCode: string,
    errorDescription: string,
  ): Promise<Result<RedirectResponse, HydraError>> {
    try {
      const response = await this.hydraAdmin.rejectOAuth2LoginRequest({
        loginChallenge: challenge,
        rejectOAuth2Request: {
          error: errorCode,
          error_description: errorDescription,
        },
      });

      return ResultUtils.ok({ redirect_to: response.redirect_to });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'reject_login',
        'Failed to reject login request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Fetch consent request details from Hydra
   */
  async getConsentRequest(
    challenge: string,
  ): Promise<Result<ConsentRequestInfo, HydraError>> {
    try {
      const response = await this.hydraAdmin.getOAuth2ConsentRequest({
        consentChallenge: challenge,
      });

      const consentRequest = HydraMapper.toConsentRequestInfo(
        challenge,
        response,
      );
      return ResultUtils.ok(consentRequest);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'consent_request',
        'Failed to fetch consent request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Accept consent request with granted scopes
   */
  async acceptConsentRequest(
    challenge: string,
    body: AcceptConsentRequest,
  ): Promise<Result<RedirectResponse, HydraError>> {
    try {
      const response = await this.hydraAdmin.acceptOAuth2ConsentRequest({
        consentChallenge: challenge,
        acceptOAuth2ConsentRequest: body,
      });

      return ResultUtils.ok({ redirect_to: response.redirect_to });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'accept_consent',
        'Failed to accept consent request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Reject consent request
   */
  async rejectConsentRequest(
    challenge: string,
    errorCode: string,
    errorDescription: string,
  ): Promise<Result<RedirectResponse, HydraError>> {
    try {
      const response = await this.hydraAdmin.rejectOAuth2ConsentRequest({
        consentChallenge: challenge,
        rejectOAuth2Request: {
          error: errorCode,
          error_description: errorDescription,
        },
      });

      return ResultUtils.ok({ redirect_to: response.redirect_to });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'reject_consent',
        'Failed to reject consent request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Create a new OAuth2 client in Hydra
   */
  async createOAuth2Client(
    clientData: CreateOAuth2Client,
  ): Promise<Result<OAuth2Client, HydraError>> {
    try {
      const response = await this.hydraAdmin.createOAuth2Client({
        oAuth2Client: clientData,
      });

      const client = HydraMapper.toOAuth2Client(response);
      return ResultUtils.ok(client);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'create_client',
        'Failed to create OAuth2 client',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Retrieve OAuth2 client configuration from Hydra
   */
  async getOAuth2Client(
    clientId: string,
  ): Promise<Result<OAuth2Client, HydraError>> {
    try {
      const response = await this.hydraAdmin.getOAuth2Client({
        id: clientId,
      });

      const client = HydraMapper.toOAuth2Client(response);
      return ResultUtils.ok(client);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'get_client',
        'Failed to retrieve OAuth2 client',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Update an existing OAuth2 client in Hydra
   */
  async updateOAuth2Client(
    clientId: string,
    clientData: CreateOAuth2Client,
  ): Promise<Result<OAuth2Client, HydraError>> {
    try {
      const response = await this.hydraAdmin.setOAuth2Client({
        id: clientId,
        oAuth2Client: clientData,
      });

      const client = HydraMapper.toOAuth2Client(response);
      return ResultUtils.ok(client);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'update_client',
        'Failed to update OAuth2 client',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * List all OAuth2 clients in Hydra
   */
  async listOAuth2Clients(
    pageSize = 100,
    pageToken?: string,
  ): Promise<Result<OAuth2Client[], HydraError>> {
    try {
      const response = await this.hydraAdmin.listOAuth2Clients({
        pageSize,
        pageToken,
      });

      const clients = response.map((client) =>
        HydraMapper.toOAuth2Client(client),
      );
      return ResultUtils.ok(clients);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'list_clients',
        'Failed to list OAuth2 clients',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Delete an OAuth2 client from Hydra
   */
  async deleteOAuth2Client(
    clientId: string,
  ): Promise<Result<void, HydraError>> {
    try {
      await this.hydraAdmin.deleteOAuth2Client({
        id: clientId,
      });

      return ResultUtils.ok(undefined);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'delete_client',
        'Failed to delete OAuth2 client',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Fetch logout request details from Hydra
   */
  async getLogoutRequest(challenge: string): Promise<Result<any, HydraError>> {
    try {
      const response = await this.hydraAdmin.getOAuth2LogoutRequest({
        logoutChallenge: challenge,
      });

      return ResultUtils.ok({
        challenge,
        subject: response.subject,
        sid: response.sid,
        request_url: response.request_url,
        rp_initiated: response.rp_initiated,
      });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'logout_request',
        'Failed to fetch logout request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Accept logout request
   */
  async acceptLogoutRequest(
    challenge: string,
  ): Promise<Result<RedirectResponse, HydraError>> {
    try {
      const response = await this.hydraAdmin.acceptOAuth2LogoutRequest({
        logoutChallenge: challenge,
      });

      return ResultUtils.ok({ redirect_to: response.redirect_to });
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'accept_logout',
        'Failed to accept logout request',
      );
      return ResultUtils.err(hydraError);
    }
  }

  /**
   * Reject logout request
   */
  async rejectLogoutRequest(
    challenge: string,
  ): Promise<Result<void, HydraError>> {
    try {
      await this.hydraAdmin.rejectOAuth2LogoutRequest({
        logoutChallenge: challenge,
      });

      return ResultUtils.ok(undefined);
    } catch (error) {
      const hydraError = HydraErrorHandler.handle(
        error,
        'reject_logout',
        'Failed to reject logout request',
      );
      return ResultUtils.err(hydraError);
    }
  }
}
