import type { LoggerService } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";

export function handleError(
  logger: LoggerService,
  logMessage: string,
  logContext: string,
  error: unknown,
  httpStatus?: HttpStatus,
  responseBody?: Record<string, unknown>
): never {
  // If it's already an HttpException, just throw it (don't log to avoid double logging)
  if (error instanceof HttpException) {
    throw error;
  }

  // Check if this is an HTTP request error (has response data)
  // This handles errors from axios, fetch, OpenAI SDK, etc.
  // If it's an HTTP error, don't log it - just throw
  const httpResponse = getHttpResponseFromError(error);
  if (httpResponse) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    // Use HTTP status from error response if available, otherwise use provided httpStatus or default to 500
    const status =
      (typeof httpResponse.status === "number" && httpResponse.status) ||
      httpStatus ||
      HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(responseBody ?? errorMessage, status);
  }

  // Build error message
  const errorMessage = error instanceof Error ? error.message : "Unknown error";

  // Log the error (only for non-HTTP errors)
  logger.error(`${logMessage}: ${errorMessage}`, logContext);

  // Throw HttpException with appropriate message
  const status = httpStatus || HttpStatus.INTERNAL_SERVER_ERROR;
  throw new HttpException(responseBody ?? errorMessage, status);
}

/**
 * Extracts HTTP response data from various error types
 * Handles errors from axios, fetch, OpenAI SDK, and other HTTP clients
 */
function getHttpResponseFromError(
  error: unknown
): Record<string, unknown> | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  // Handle axios errors
  if ("response" in error && error.response) {
    const response = error.response as {
      status?: number;
      statusText?: string;
      data?: unknown;
      headers?: Record<string, unknown>;
    };
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
    };
  }

  // Handle fetch API errors (Response object)
  if (error instanceof Response) {
    return {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    };
  }

  // Handle OpenAI SDK errors and similar structures
  if ("status" in error || "statusCode" in error) {
    const httpError = error as {
      status?: number;
      statusCode?: number;
      message?: string;
      response?: {
        data?: unknown;
        headers?: Record<string, unknown>;
      };
    };
    return {
      status: httpError.status || httpError.statusCode,
      message: httpError.message,
      responseData: httpError.response?.data,
      responseHeaders: httpError.response?.headers,
    };
  }

  return null;
}
