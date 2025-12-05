/**
 * Kratos Error Handler
 * Transforms Kratos API errors into structured error objects
 */

import { HttpErrorResponse } from '../common/types/error.types';

export interface KratosError {
  code: string;
  message: string;
  hint?: string;
  statusCode: number;
}

export class KratosErrorHandler {
  /**
   * Handle Kratos API errors and transform them into structured error objects
   */
  static handle(
    error: HttpErrorResponse,
    operation: string,
    defaultMessage: string,
  ): KratosError {
    // Handle 400 - Invalid credentials or bad request
    if (error.response?.status === 400 || error.status === 400) {
      return {
        code: 'invalid_request',
        message:
          error.message || `Invalid ${operation.replace('_', ' ')} request`,
        hint: 'Please check your request parameters and try again',
        statusCode: 400,
      };
    }

    // Handle 404 - Not found
    if (error.response?.status === 404 || error.status === 404) {
      return {
        code: 'not_found',
        message: `The ${operation.replace('_', ' ')} was not found`,
        hint: 'Please check the identifier and try again',
        statusCode: 404,
      };
    }

    // Handle 410 - Flow expired or replaced
    if (error.response?.status === 410 || error.status === 410) {
      return {
        code: 'flow_expired',
        message: `The ${operation.replace('_', ' ')} has expired or been replaced`,
        hint: 'Please request a new verification code',
        statusCode: 410,
      };
    }

    // Handle connection errors - Kratos unavailable
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('fetch failed')
    ) {
      return {
        code: 'kratos_unavailable',
        message: 'Unable to communicate with the identity provider',
        hint: 'Please try again later or contact support',
        statusCode: 503,
      };
    }

    // Handle other HTTP errors
    if (error.response?.status || error.status) {
      const status = (error.response?.status || error.status) ?? 500;
      return {
        code: 'kratos_error',
        message: error.message || defaultMessage,
        hint: 'An unexpected error occurred with the identity provider',
        statusCode: status,
      };
    }

    // Generic error fallback
    return {
      code: 'internal_error',
      message: defaultMessage,
      hint: 'An unexpected error occurred',
      statusCode: 500,
    };
  }

  /**
   * Convert KratosError to NestJS exception format
   */
  static toExceptionResponse(error: KratosError) {
    return {
      error: error.code,
      error_description: error.message,
      error_hint: error.hint,
      status_code: error.statusCode,
    };
  }
}
