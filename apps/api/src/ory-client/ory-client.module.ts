import { Module, Global, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration, FrontendApi, IdentityApi } from '@ory/client-fetch';

const frontendApiProvider = {
  provide: FrontendApi,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('FrontendApi');
    const kratosPublicUrl =
      configService.get<string>('KRATOS_PUBLIC_URL') || 'http://localhost:4433';

    logger.log(`Initializing FrontendApi with URL: ${kratosPublicUrl}`);

    const configuration = new Configuration({
      basePath: kratosPublicUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      fetchApi: fetch,
    });
    return new FrontendApi(configuration);
  },
  inject: [ConfigService],
};

const identityApiProvider = {
  provide: IdentityApi,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('IdentityApi');
    const kratosAdminUrl =
      configService.get<string>('KRATOS_ADMIN_URL') || 'http://localhost:4434';

    logger.log(`Initializing IdentityApi with URL: ${kratosAdminUrl}`);

    const configuration = new Configuration({
      basePath: kratosAdminUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      fetchApi: fetch,
    });
    return new IdentityApi(configuration);
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [frontendApiProvider, identityApiProvider],
  exports: [FrontendApi, IdentityApi],
})
export class OryClientModule {}
