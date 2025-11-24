import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { KratosModule } from '../kratos/kratos.module';
import { HydraModule } from '../hydra/hydra.module';

@Module({
  imports: [KratosModule, HydraModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
