/**
 * Mappers for transforming Hydra API responses to our DTOs
 */

import {
  OAuth2LoginRequest,
  OAuth2ConsentRequest,
  OAuth2Client as HydraOAuth2Client,
} from '@ory/client-fetch';
import { LoginRequestInfo, ConsentRequestInfo, OAuth2Client } from '@repo/api';

export class HydraMapper {
  /**
   * Map Hydra request response to RequestInfo DTO
   * Used for both login and consent requests since they have the same structure
   */
  private static toRequestInfo(
    challenge: string,
    response: OAuth2LoginRequest | OAuth2ConsentRequest,
  ): LoginRequestInfo | ConsentRequestInfo {
    return {
      challenge,
      skip: response.skip || false,
      subject: response.subject || '',
      client: {
        client_id: response.client?.client_id || '',
        client_name: response.client?.client_name || '',
        logo_uri: response.client?.logo_uri,
      },
      requested_scope: response.requested_scope || [],
      requested_access_token_audience:
        response.requested_access_token_audience || [],
    };
  }

  /**
   * Map Hydra login request response to LoginRequestInfo DTO
   */
  static toLoginRequestInfo(
    challenge: string,
    response: OAuth2LoginRequest,
  ): LoginRequestInfo {
    return this.toRequestInfo(challenge, response) as LoginRequestInfo;
  }

  /**
   * Map Hydra consent request response to ConsentRequestInfo DTO
   */
  static toConsentRequestInfo(
    challenge: string,
    response: OAuth2ConsentRequest,
  ): ConsentRequestInfo {
    return this.toRequestInfo(challenge, response) as ConsentRequestInfo;
  }

  /**
   * Map Hydra OAuth2 client response to OAuth2Client DTO
   */
  static toOAuth2Client(response: HydraOAuth2Client): OAuth2Client {
    return {
      client_id: response.client_id || '',
      client_name: response.client_name,
      client_secret: response.client_secret,
      redirect_uris: response.redirect_uris,
      grant_types: response.grant_types,
      response_types: response.response_types,
      scope: response.scope,
      token_endpoint_auth_method: response.token_endpoint_auth_method,
      audience: response.audience,
      logo_uri: response.logo_uri,
      client_uri: response.client_uri,
      policy_uri: response.policy_uri,
      tos_uri: response.tos_uri,
      contacts: response.contacts,
      metadata: response.metadata,
      created_at: response.created_at,
      updated_at: response.updated_at,
    };
  }
}
