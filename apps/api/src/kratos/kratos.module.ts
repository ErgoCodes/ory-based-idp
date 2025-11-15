import { Module } from '@nestjs/common';
import { KratosService } from './kratos.service';
import { OryClientModule } from '../ory-client/ory-client.module';

@Module({
  imports: [OryClientModule],
  providers: [KratosService],
  exports: [KratosService],
})
export class KratosModule {}
