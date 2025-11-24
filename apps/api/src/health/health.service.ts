import { Injectable, HttpStatus } from '@nestjs/common';
import { KratosService } from '../kratos/kratos.service';
import { Configuration, FrontendApi, OAuth2Api } from '@ory/client-fetch';

@Injectable()
export class HealthService {
  constructor(
    private readonly kratosService: KratosService,
    private readonly hydraAdmin: OAuth2Api,
  ) {}

  async check() {
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    const services = {
      api: 'healthy',
      kratos: await this.checkKratos(),
      hydra: await this.checkHydra(),
    };

    const allHealthy = Object.values(services).every(
      (status) => status === 'healthy',
    );

    return {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp,
      uptime: Math.floor(uptime),
      services,
    };
  }

  private async checkKratos(): Promise<string> {
    try {
      // Try to call Kratos health endpoint or a simple operation
      const kratosPublic = new FrontendApi(
        new Configuration({
          basePath: process.env.KRATOS_PUBLIC_URL,
        }),
      );

      await kratosPublic.toSession();
      return 'healthy';
    } catch (error) {
      // If error is 401, Kratos is responding (just no session)
      if (error?.response?.status === 401) {
        return 'healthy';
      }
      return 'unhealthy';
    }
  }

  private async checkHydra(): Promise<string> {
    try {
      // Try to list clients (will fail if Hydra is down)
      await this.hydraAdmin.listOAuth2Clients({ pageSize: 1 });
      return 'healthy';
    } catch (error) {
      return 'unhealthy';
    }
  }
}
