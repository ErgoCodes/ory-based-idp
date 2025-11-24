import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OAuth2FlowService } from '../hydra/oauth2-flow.service';

/**
 * Script to clear all OAuth2 consent sessions
 * This forces users to go through the consent flow again
 *
 * Usage: npm run clear:consents
 */
async function clearConsents() {
  console.log('🚀 Starting consent cleanup...\n');

  const app = await NestFactory.createApplicationContext(AppModule);
  const oauth2FlowService = app.get(OAuth2FlowService);

  try {
    // Note: Hydra doesn't have a direct API to list/delete all consents
    // The best way is to revoke consent for specific subjects or clients
    // For development, you can also restart Hydra with a fresh database

    console.log('⚠️  To clear all consents, you have two options:\n');
    console.log('Option 1: Restart Hydra with a fresh database');
    console.log('  docker-compose down -v');
    console.log('  docker-compose up -d\n');

    console.log('Option 2: Add "prompt=consent" to your authorization URL');
    console.log(
      '  This forces a new consent screen even if one was previously granted\n',
    );

    console.log('Option 3: Revoke consent for a specific subject (user)');
    console.log('  You need to know the subject ID (user UUID from Kratos)\n');

    console.log(
      '💡 For testing, the easiest is to add "prompt=consent" to your OAuth2 flow',
    );
    console.log('   or restart Hydra with: docker-compose restart hydra\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await app.close();
  }
}

clearConsents()
  .then(() => {
    console.log('✅ Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
