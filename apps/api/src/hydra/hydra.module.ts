import { Module } from '@nestjs/common';
import { HydraService } from './hydra.service';
import { HydraController } from './hydra.controller';
import { KratosModule } from '../kratos/kratos.module';

@Module({
  imports: [KratosModule],
  controllers: [HydraController],
  providers: [HydraService],
  exports: [HydraService],
})
export class HydraModule {}
