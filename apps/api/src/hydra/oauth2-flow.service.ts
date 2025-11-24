import { Injectable } from '@nestjs/common';
import { OAuth2Api } from '@ory/client-fetch';
import {
  LoginRequestInfo,
  ConsentRequestInfo,
  AcceptLoginRequest,
  AcceptConsentRequest,
  RedirectResponse,
} from '@repo/api';
import { Result, ResultUtils } from '../common/result';
import { HydraError, HydraErrorHandler } from './hydra-error.handler';
import { HydraMapper } from './mappers/hydra.mapper';

@Injectable()
export class OAuth2FlowService {
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
