import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { KratosModule } from '../kratos/kratos.module';

@Module({
  imports: [KratosModule],
  controllers: [AuthController],
  providers: [],
})
export class AuthModule {}
