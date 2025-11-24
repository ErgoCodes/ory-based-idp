/**
 * Interceptor to convert Result errors to HTTP exceptions
 * This allows controllers to work with Results while still throwing proper HTTP exceptions
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ErrorWithStatusCode {
  code: string;
  message: string;
  hint?: string;
  statusCode: number;
}

@Injectable()
export class ResultToExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        // If the response is a Result with success: false, throw an exception
        if (data && typeof data === 'object' && 'success' in data) {
          if (data.success === false && 'error' in data) {
            throw this.convertToHttpException(
              data.error as ErrorWithStatusCode,
            );
          }
          // If success: true, return the value
          if (data.success === true && 'value' in data) {
            return data.value;
          }
        }
        // Otherwise, return data as-is
        return data;
      }),
    );
  }

  private convertToHttpException(error: ErrorWithStatusCode): HttpException {
    const response = {
      error: error.code,
      error_description: error.message,
      error_hint: error.hint,
      status_code: error.statusCode,
    };

    switch (error.statusCode) {
      case 404:
        return new NotFoundException(response);
      case 400:
      case 410:
        return new BadRequestException(response);
      case 503:
        return new ServiceUnavailableException(response);
      default:
        return new InternalServerErrorException(response);
    }
  }
}
