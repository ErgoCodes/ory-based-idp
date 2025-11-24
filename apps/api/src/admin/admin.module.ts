import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { KratosModule } from '../kratos/kratos.module';

@Module({
  imports: [KratosModule],
  controllers: [AdminController],
})
export class AdminModule {}
