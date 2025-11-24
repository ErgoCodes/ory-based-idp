import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KratosService } from '../../kratos/kratos.service';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(private readonly kratosService: KratosService) {}

  async onModuleInit() {
    await this.createDefaultSuperadmin();
  }

  private async createDefaultSuperadmin() {
    const email = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SUPERADMIN_PASSWORD || 'changeme123';

    try {
      // Check if superadmin already exists
      const existingResult = await this.kratosService.getIdentityByEmail(email);

      if (existingResult.success && existingResult.value) {
        this.logger.log(
          `Superadmin with email ${email} already exists. Skipping creation.`,
        );
        return;
      }

      // Create superadmin identity
      this.logger.log(`Creating default superadmin with email: ${email}`);

      const result = await this.kratosService.createIdentity(
        {
          email,
          password,
          firstName: 'Super',
          lastName: 'Admin',
        },
        'superadmin', // Explicitly set role to superadmin
      );

      if (result.success) {
        this.logger.log(
          `Default superadmin created successfully with ID: ${result.value.id}`,
        );
        this.logger.warn(
          `IMPORTANT: Please change the default superadmin password immediately!`,
        );
      } else {
        this.logger.error(
          `Failed to create default superadmin: ${result.error.message}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `Error during superadmin initialization: ${error.message}`,
      );
    }
  }
}
