import { Module } from '@nestjs/common';
import { OAuth2FlowService } from './oauth2-flow.service';
import { OAuth2ClientsService } from './oauth2-clients.service';
import { OAuth2FlowController } from './oauth2-flow.controller';
import { OAuth2ClientsController } from './oauth2-clients.controller';
import { KratosModule } from '../kratos/kratos.module';

@Module({
  imports: [KratosModule],
  controllers: [OAuth2FlowController, OAuth2ClientsController],
  providers: [OAuth2FlowService, OAuth2ClientsService],
  exports: [OAuth2FlowService, OAuth2ClientsService],
})
export class HydraModule {}
