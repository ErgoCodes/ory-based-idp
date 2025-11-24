import { Injectable } from '@nestjs/common';
import { FrontendApi, IdentityApi } from '@ory/client-fetch';
import { RegisterUser, Identity } from '@repo/api';
import { Result, ResultUtils } from '../common/result';
import { KratosError, KratosErrorHandler } from './kratos-error.handler';
import { KratosMapper } from './mappers/kratos.mapper';

@Injectable()
export class KratosService {
  constructor(
    private readonly frontendApi: FrontendApi,
    private readonly identityApi: IdentityApi,
  ) {}

  /**
   * Create a registration flow
   */
  async createRegistrationFlow(): Promise<Result<{ id: string }, KratosError>> {
    try {
      const flow = await this.frontendApi.createNativeRegistrationFlow();
      return ResultUtils.ok({ id: flow.id });
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'registration_flow',
        'Failed to create registration flow',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Register a new user
   */
  async registerUser(
    flowId: string,
    userData: RegisterUser,
  ): Promise<Result<Identity, KratosError>> {
    try {
      const response = await this.frontendApi.updateRegistrationFlow({
        flow: flowId,
        updateRegistrationFlowBody: {
          method: 'password',
          password: userData.password,
          traits: {
            email: userData.email,
            name: {
              first: userData.firstName,
              last: userData.lastName,
            },
            role: 'user', // Always assign "user" role for public registration
          },
        },
      });

      if (response.identity) {
        const identity = KratosMapper.toIdentity(response.identity);
        return ResultUtils.ok(identity);
      }

      return ResultUtils.err({
        code: 'registration_failed',
        message: 'Registration failed - no identity returned',
        statusCode: 500,
      });
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'registration',
        'Registration failed',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Get an identity by ID
   */
  async getIdentity(
    identityId: string,
  ): Promise<Result<Identity, KratosError>> {
    try {
      const identity = await this.identityApi.getIdentity({ id: identityId });
      const mappedIdentity = KratosMapper.toIdentity(identity);
      return ResultUtils.ok(mappedIdentity);
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'get_identity',
        'Failed to get identity',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * List all identities
   */
  async listIdentities(
    pageSize = 100,
    pageToken?: string,
  ): Promise<Result<Identity[], KratosError>> {
    try {
      const identities = await this.identityApi.listIdentities({
        pageSize,
        pageToken,
      });

      const mappedIdentities = identities.map((identity) =>
        KratosMapper.toIdentity(identity),
      );
      return ResultUtils.ok(mappedIdentities);
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'list_identities',
        'Failed to list identities',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Create an identity directly using Admin API
   */
  async createIdentity(
    userData: RegisterUser,
    role: 'user' | 'superadmin' = 'user',
  ): Promise<Result<Identity, KratosError>> {
    try {
      const identity = await this.identityApi.createIdentity({
        createIdentityBody: {
          schema_id: 'default',
          traits: {
            email: userData.email,
            name: {
              first: userData.firstName,
              last: userData.lastName,
            },
            role: role,
          },
          credentials: {
            password: {
              config: {
                password: userData.password,
              },
            },
          },
        },
      });

      const mappedIdentity = KratosMapper.toIdentity(identity);
      return ResultUtils.ok(mappedIdentity);
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'create_identity',
        'Failed to create identity',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Verify user credentials using native login flow
   * Returns identity if credentials are valid, error if invalid
   */
  async verifyCredentials(
    email: string,
    password: string,
  ): Promise<Result<Identity, KratosError>> {
    try {
      const loginFlow = await this.frontendApi.createNativeLoginFlow();

      const result = await this.frontendApi.updateLoginFlow({
        flow: loginFlow.id,
        updateLoginFlowBody: {
          method: 'password',
          identifier: email,
          password: password,
        },
      });

      if (result.session?.identity) {
        const identity = KratosMapper.toIdentity(result.session.identity);
        return ResultUtils.ok(identity);
      }

      return ResultUtils.err({
        code: 'invalid_credentials',
        message: 'Invalid email or password',
        hint: 'Please check your credentials and try again',
        statusCode: 401,
      });
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'verify_credentials',
        'Failed to verify credentials',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Retrieve user identity by email using Admin API
   */
  async getIdentityByEmail(
    email: string,
  ): Promise<Result<Identity | null, KratosError>> {
    try {
      // List identities filtered by email trait
      const identities = await this.identityApi.listIdentities({
        pageSize: 1,
        credentialsIdentifier: email,
      });

      // Return the first identity if found
      if (identities && identities.length > 0) {
        const identity = KratosMapper.toIdentity(identities[0]);
        return ResultUtils.ok(identity);
      }

      return ResultUtils.ok(null);
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'get_identity_by_email',
        'Failed to retrieve identity by email',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Update an identity's traits
   */
  async updateIdentity(
    identityId: string,
    traits: any,
  ): Promise<Result<Identity, KratosError>> {
    try {
      const identity = await this.identityApi.updateIdentity({
        id: identityId,
        updateIdentityBody: {
          schema_id: 'default',
          state: 'active',
          traits: traits,
        },
      });

      const mappedIdentity = KratosMapper.toIdentity(identity);
      return ResultUtils.ok(mappedIdentity);
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'update_identity',
        'Failed to update identity',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Update a user's password using Kratos Admin API
   * Note: This is a workaround since Kratos doesn't support direct password updates
   * The proper way would be to use the settings flow from the frontend
   */
  async updatePassword(
    identityId: string,
    newPassword: string,
  ): Promise<Result<{ success: boolean }, KratosError>> {
    try {
      const currentIdentity = await this.identityApi.getIdentity({
        id: identityId,
      });

      await this.identityApi.updateIdentity({
        id: identityId,
        updateIdentityBody: {
          schema_id: currentIdentity.schema_id || 'default',
          state: currentIdentity.state || 'active',
          traits: currentIdentity.traits,
          credentials: {
            password: {
              config: {
                password: newPassword,
              },
            },
          },
        },
      });

      return ResultUtils.ok({ success: true });
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'update_password',
        'Failed to update password',
      );
      return ResultUtils.err(kratosError);
    }
  }

  /**
   * Delete an identity
   */
  async deleteIdentity(
    identityId: string,
  ): Promise<Result<{ success: boolean }, KratosError>> {
    try {
      await this.identityApi.deleteIdentity({ id: identityId });
      return ResultUtils.ok({ success: true });
    } catch (error) {
      const kratosError = KratosErrorHandler.handle(
        error as never,
        'delete_identity',
        'Failed to delete identity',
      );
      return ResultUtils.err(kratosError);
    }
  }
}
