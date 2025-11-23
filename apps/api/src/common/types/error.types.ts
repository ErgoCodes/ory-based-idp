/**
 * Common error types used across the application
 */

export interface HttpErrorResponse {
  response?: {
    status?: number;
  };
  status?: number;
  code?: string;
  message?: string;
}

export interface UnknownError {
  message?: string;
  [key: string]: unknown;
}
