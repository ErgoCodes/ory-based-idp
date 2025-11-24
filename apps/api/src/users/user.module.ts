import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { KratosModule } from '../kratos/kratos.module';

@Module({
  imports: [KratosModule],
  controllers: [UserController],
})
export class UserModule {}
