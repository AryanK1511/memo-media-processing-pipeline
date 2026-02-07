/** biome-ignore-all lint/suspicious/noExplicitAny: can be anything */
import { Injectable, Logger, type LoggerService } from "@nestjs/common";
import { getCurrentTraceId } from "./trace.interceptor";

@Injectable()
export class LoggerTrace implements LoggerService {
	private readonly logger = new Logger();

	private formatMessage(message: any, context?: string): string {
		const traceId = getCurrentTraceId();
		const traceInfo = traceId ? `[${traceId}]` : "[No Trace]";
		const contextInfo = context ? `[${context}]` : "";

		if (message instanceof Object) {
			message = JSON.stringify(message);
			message = message.replace(/\\n/g, "\n");
			message = message.replace(/\\n/g, " ");
		}

		return `${contextInfo}${traceInfo} ${message}`;
	}

	log(message: any, context?: string) {
		this.logger.log(this.formatMessage(message, context));
	}

	error(message: any, trace?: string, context?: string) {
		this.logger.error(this.formatMessage(message, context), trace);
	}

	warn(message: any, context?: string) {
		this.logger.warn(this.formatMessage(message, context));
	}

	debug(message: any, context?: string) {
		this.logger.debug(this.formatMessage(message, context));
	}

	verbose(message: any, context?: string) {
		this.logger.verbose(this.formatMessage(message, context));
	}
}
