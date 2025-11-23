import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OryClientModule } from './ory-client/ory-client.module';
import { KratosModule } from './kratos/kratos.module';
import { AuthModule } from './auth/auth.module';
import { HydraModule } from './hydra/hydra.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    OryClientModule,
    KratosModule,
    AuthModule,
    HydraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
