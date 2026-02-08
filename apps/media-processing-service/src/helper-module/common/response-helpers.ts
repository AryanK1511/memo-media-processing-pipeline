import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Creates a standardized error response
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param details - Optional additional error details
 * @returns HttpException instance
 */
export function makeErrorResponse(
	message: string,
	statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
	details?: Record<string, unknown>,
): HttpException {
	return new HttpException(
		{
			success: false,
			message,
			...(details && { details }),
			timestamp: new Date().toISOString(),
		},
		statusCode,
	);
}

/**
 * Creates a standardized success response
 * @param data - Response data
 * @param message - Success message (optional)
 * @param statusCode - HTTP status code (default: 200)
 * @returns Success response object
 */
export function makeSuccessResponse<T>(
	data: T,
	message?: string,
	statusCode: HttpStatus = HttpStatus.OK,
): {
	success: boolean;
	data: T;
	message?: string;
	timestamp: string;
	statusCode: number;
} {
	return {
		success: true,
		data,
		...(message && { message }),
		timestamp: new Date().toISOString(),
		statusCode,
	};
}
