/**
 * Response mappers for transforming DTOs to API responses
 * Used to filter sensitive data before sending to clients
 */

import { OAuth2Client } from '@repo/api';

export class ResponseMapper {
  /**
   * Map OAuth2Client to public response (excluding sensitive data)
   */
  static toPublicOAuth2Client(client: OAuth2Client) {
    const { client_secret, ...publicClient } = client;
    return publicClient;
  }

  /**
   * Map OAuth2Client to creation response (including client_secret)
   */
  static toOAuth2ClientCreationResponse(client: OAuth2Client) {
    return {
      client_id: client.client_id,
      client_secret: client.client_secret,
      client_name: client.client_name,
      redirect_uris: client.redirect_uris,
      grant_types: client.grant_types,
      response_types: client.response_types,
      scope: client.scope,
      token_endpoint_auth_method: client.token_endpoint_auth_method,
      created_at: client.created_at,
    };
  }
}
