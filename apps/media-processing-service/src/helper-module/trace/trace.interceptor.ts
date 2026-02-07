import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import type { Response } from "express";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { type RequestContext, requestContext } from "../common";

export function getCurrentTraceId(): string | undefined {
	const context = requestContext.getStore();
	return context?.traceId;
}

@Injectable()
export class TraceInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const response = context.switchToHttp().getResponse<Response>();

		const now = new Date();
		const traceId =
			uuidv4() +
			"-" +
			now.toISOString().replace(/-/g, "").split("T")[0] +
			"-" +
			now.toLocaleTimeString("en-US", { hour12: false }).replace(/:/g, "");

		response.setHeader("x-Trace-Id", traceId);

		return new Observable((subscriber) => {
			// Get existing context to preserve user info if it exists
			const existingContext = requestContext.getStore();
			const newContext: RequestContext = {
				...(existingContext || {}),
				traceId,
			};

			requestContext.run(newContext, () => {
				next.handle().subscribe({
					next: (value) => subscriber.next(value),
					error: (error) => subscriber.error(error),
					complete: () => subscriber.complete(),
				});
			});
		});
	}
}
