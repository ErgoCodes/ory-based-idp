import { Injectable, BadRequestException } from '@nestjs/common';
import { FrontendApi, IdentityApi } from '@ory/client-fetch';
import type { RegisterUserDto } from '@repo/api/dtos/user.dto';

@Injectable()
export class KratosService {
  constructor(
    private readonly frontendApi: FrontendApi,
    private readonly identityApi: IdentityApi,
  ) {}

  async createRegistrationFlow() {
    try {
      // Usar createNativeRegistrationFlow para APIs (no browser)
      // O usar createBrowserRegistrationFlow con returnTo
      const flow = await this.frontendApi.createNativeRegistrationFlow();
      return flow;
    } catch (error) {
      throw new BadRequestException(
        `Failed to create registration flow: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async registerUser(flowId: string, userData: RegisterUserDto) {
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
          },
        },
      });

      return response;
    } catch (error) {
      throw new BadRequestException(
        error.response?.data?.ui?.messages?.[0]?.text || 'Registration failed',
      );
    }
  }

  /**
   * Obtiene una identidad por ID (usando Admin API)
   */
  async getIdentity(identityId: string) {
    try {
      const identity = await this.identityApi.getIdentity({ id: identityId });
      return identity;
    } catch (error) {
      throw new BadRequestException(error, 'Failed to get identity');
    }
  }

  /**
   * Lista todas las identidades (usando Admin API)
   */
  async listIdentities(pageSize = 100, pageToken?: string) {
    try {
      const identities = await this.identityApi.listIdentities({
        pageSize,
        pageToken,
      });
      return identities;
    } catch (error) {
      throw new BadRequestException(error, 'Failed to list identities');
    }
  }

  /**
   * Crea una identidad directamente (usando Admin API)
   */
  async createIdentity(userData: RegisterUserDto) {
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

      return identity;
    } catch (error) {
      throw new BadRequestException(error, 'Failed to create identity');
    }
  }
}
