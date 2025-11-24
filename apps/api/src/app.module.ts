import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common/common.module';
import { OryClientModule } from './ory-client/ory-client.module';
import { KratosModule } from './kratos/kratos.module';
import { AuthModule } from './auth/auth.module';
import { HydraModule } from './hydra/hydra.module';
import { UserModule } from './users/user.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { AuthGuard } from './common/guards/auth.guard';
import { InitService } from './common/services/init.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    OryClientModule,
    KratosModule,
    AuthModule,
    HydraModule,
    UserModule,
    AdminModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    InitService,
  ],
})
export class AppModule {}
