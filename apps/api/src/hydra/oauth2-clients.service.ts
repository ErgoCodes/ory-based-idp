import { Injectable } from '@nestjs/common';
import { OAuth2Api } from '@ory/client-fetch';
import { CreateOAuth2Client, OAuth2Client } from '@repo/api';
import { Result, ResultUtils } from '../common/result';
import { HydraError, HydraErrorHandler } from './hydra-error.handler';
import { HydraMapper } from './mappers/hydra.mapper';

@Injectable()
export class OAuth2ClientsService {
  constructor(private readonly hydraAdmin: OAuth2Api) {}

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
}
