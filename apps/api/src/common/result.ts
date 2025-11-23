/**
 * Result pattern for handling success and error cases without throwing exceptions
 * This allows services to return errors as values instead of throwing exceptions
 */

export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

export class ResultUtils {
  static ok<T>(value: T): Result<T, never> {
    return { success: true, value };
  }

  static err<E>(error: E): Result<never, E> {
    return { success: false, error };
  }

  static isOk<T, E>(
    result: Result<T, E>,
  ): result is { success: true; value: T } {
    return result.success === true;
  }

  static isErr<T, E>(
    result: Result<T, E>,
  ): result is { success: false; error: E } {
    return result.success === false;
  }

  /**
   * Unwrap the value from a Result, throwing if it's an error
   * Use this when you're certain the result is Ok
   */
  static unwrap<T, E>(result: Result<T, E>): T {
    if (result.success) {
      return result.value;
    }
    throw result.error;
  }

  /**
   * Get the value or a default if the result is an error
   */
  static unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
    if (result.success) {
      return result.value;
    }
    return defaultValue;
  }

  /**
   * Map the value of a successful result
   */
  static map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    if (result.success) {
      return ResultUtils.ok(fn(result.value));
    }
    return result;
  }

  /**
   * Map the error of a failed result
   */
  static mapErr<T, E, F>(
    result: Result<T, E>,
    fn: (error: E) => F,
  ): Result<T, F> {
    if (!result.success) {
      return ResultUtils.err(fn(result.error));
    }
    return result;
  }
}
