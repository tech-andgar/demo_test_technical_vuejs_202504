/**
 * Base API error class
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Error for network/connectivity issues
 */
export class NetworkError extends APIError {
  constructor(
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Error for data format/parsing issues
 */
export class DataFormatError extends APIError {
  constructor(
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'DataFormatError';
  }
}

/**
 * Helper function to handle API errors
 *
 * @param error - The error object to handle
 * @param context - The context in which the error occurred
 * @returns Never
 */
export const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof Error) {
    if (
      error.name === 'NetworkError' ||
      error.name === 'APIError' ||
      error.name === 'DataFormatError'
    ) {
      throw error;
    }
    throw new NetworkError(`Error in ${context}: ${error.message}`, error);
  }
  throw new APIError(`Unknown error in ${context}`);
};
