import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Body,
  Param,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OAuth2ClientsService } from './oauth2-clients.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { CreateOAuth2ClientSchema, CreateOAuth2Client } from '@repo/api';
import { ResponseMapper } from './mappers/response.mapper';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('OAuth2 Clients')
@Controller('oauth2/clients')
@UseGuards(RolesGuard)
@Roles('superadmin')
export class OAuth2ClientsController {
  constructor(private readonly oauth2ClientsService: OAuth2ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create OAuth2 client (superadmin only)' })
  @ApiBody({
    description: 'OAuth2 client data',
    schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string', example: 'My Application' },
        redirect_uris: {
          type: 'array',
          items: { type: 'string' },
          example: ['http://localhost:8363/api/auth/callback/hydra'],
        },
        grant_types: {
          type: 'array',
          items: { type: 'string' },
          example: ['authorization_code', 'refresh_token'],
        },
        response_types: {
          type: 'array',
          items: { type: 'string' },
          example: ['code'],
        },
        scope: { type: 'string', example: 'openid email profile' },
        token_endpoint_auth_method: {
          type: 'string',
          example: 'client_secret_post',
        },
      },
      required: ['client_name', 'redirect_uris'],
    },
  })
  @ApiResponse({ status: 201, description: 'Client created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  async createClient(
    @Body(new ZodValidationPipe(CreateOAuth2ClientSchema))
    clientData: CreateOAuth2Client,
  ) {
    const result =
      await this.oauth2ClientsService.createOAuth2Client(clientData);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toOAuth2ClientCreationResponse(result.value),
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all OAuth2 clients (superadmin only)' })
  @ApiResponse({ status: 200, description: 'Clients retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  async listClients(
    @Query('pageSize') pageSize?: number,
    @Query('pageToken') pageToken?: string,
  ) {
    const result = await this.oauth2ClientsService.listOAuth2Clients(
      pageSize,
      pageToken,
    );

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: result.value.map((client) =>
        ResponseMapper.toPublicOAuth2Client(client),
      ),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get OAuth2 client by ID (superadmin only)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 200, description: 'Client retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid client ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getClient(@Param('id') clientId: string) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.oauth2ClientsService.getOAuth2Client(clientId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toPublicOAuth2Client(result.value),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update OAuth2 client (superadmin only)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiBody({
    description: 'Updated client data',
    schema: {
      type: 'object',
      properties: {
        client_name: { type: 'string', example: 'My Updated Application' },
        redirect_uris: {
          type: 'array',
          items: { type: 'string' },
          example: ['http://localhost:8363/api/auth/callback/hydra'],
        },
        grant_types: {
          type: 'array',
          items: { type: 'string' },
          example: ['authorization_code', 'refresh_token'],
        },
        response_types: {
          type: 'array',
          items: { type: 'string' },
          example: ['code'],
        },
        scope: { type: 'string', example: 'openid email profile' },
        token_endpoint_auth_method: {
          type: 'string',
          example: 'client_secret_post',
        },
      },
      required: ['client_name', 'redirect_uris'],
    },
  })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async updateClient(
    @Param('id') clientId: string,
    @Body(new ZodValidationPipe(CreateOAuth2ClientSchema))
    clientData: CreateOAuth2Client,
  ) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.oauth2ClientsService.updateOAuth2Client(
      clientId,
      clientData,
    );

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      value: ResponseMapper.toOAuth2ClientCreationResponse(result.value),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete OAuth2 client (superadmin only)' })
  @ApiParam({ name: 'id', description: 'Client ID' })
  @ApiResponse({ status: 204, description: 'Client deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid client ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - superadmin role required',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async deleteClient(@Param('id') clientId: string) {
    if (!clientId) {
      throw new BadRequestException({
        error: 'missing_client_id',
        error_description: 'Client ID parameter is required',
        error_hint: 'Please provide a valid client ID',
      });
    }

    const result = await this.oauth2ClientsService.deleteOAuth2Client(clientId);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
    };
  }
}
