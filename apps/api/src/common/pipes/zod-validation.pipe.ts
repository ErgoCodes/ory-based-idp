import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log('ZodValidationPipe - Validating:', {
      type: metadata.type,
      data: value,
    });

    try {
      const parsedValue = this.schema.parse(value);
      console.log('ZodValidationPipe - Validation successful');
      return parsedValue;
    } catch (error) {
      console.error('ZodValidationPipe - Validation failed:', error.errors);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: error.errors,
      });
    }
  }
}
