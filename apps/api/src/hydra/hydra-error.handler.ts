/**
 * Hydra Error Handler
 * Transforms Hydra API errors into structured error objects
 */

import { HttpErrorResponse } from '../common/types/error.types';

export interface HydraError {
  code: string;
  message: string;
  hint?: string;
  statusCode: number;
}

export class HydraErrorHandler {
  /**
   * Handle Hydra API errors and transform them into structured error objects
   * @param error - The error from Hydra API
   * @param operation - The operation that failed (e.g., 'login_request', 'accept_consent')
   * @param defaultMessage - Default error message if none is provided
   * @returns Structured error object
   */
  static handle(
    error: HttpErrorResponse,
    operation: string,
    defaultMessage: string,
  ): HydraError {
    // Handle 404 - Challenge not found or expired
    if (error.response?.status === 404 || error.status === 404) {
      return {
        code: 'challenge_not_found',
        message: `The ${operation.replace('_', ' ')} challenge was not found or has expired`,
        hint: 'Please restart the OAuth2 flow from the beginning',
        statusCode: 404,
      };
    }

    // Handle 410 - Challenge already used
    if (error.response?.status === 410 || error.status === 410) {
      return {
        code: 'challenge_already_used',
        message: `The ${operation.replace('_', ' ')} challenge has already been used`,
        hint: 'Please restart the OAuth2 flow from the beginning',
        statusCode: 410,
      };
    }

    // Handle 400 - Invalid request
    if (error.response?.status === 400 || error.status === 400) {
      return {
        code: 'invalid_request',
        message:
          error.message || `Invalid ${operation.replace('_', ' ')} request`,
        hint: 'Please check your request parameters and try again',
        statusCode: 400,
      };
    }

    // Handle connection errors - Hydra unavailable
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.code === 'ETIMEDOUT' ||
      error.message?.includes('fetch failed')
    ) {
      return {
        code: 'hydra_unavailable',
        message: 'Unable to communicate with the authorization server',
        hint: 'Please try again later or contact support',
        statusCode: 503,
      };
    }

    // Handle other HTTP errors
    if (error.response?.status || error.status) {
      const status = (error.response?.status || error.status) ?? 500;
      return {
        code: 'hydra_error',
        message: error.message || defaultMessage,
        hint: 'An unexpected error occurred with the authorization server',
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
   * Convert HydraError to NestJS exception format
   */
  static toExceptionResponse(error: HydraError) {
    return {
      error: error.code,
      error_description: error.message,
      error_hint: error.hint,
      status_code: error.statusCode,
    };
  }
}
