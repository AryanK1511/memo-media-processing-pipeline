import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggerTrace } from "./logger.service";
import { TraceInterceptor } from "./trace.interceptor";

@Module({
	imports: [ConfigModule],
	providers: [
		LoggerTrace,
		{
			provide: APP_INTERCEPTOR,
			useClass: TraceInterceptor,
		},
	],
	exports: [LoggerTrace],
})
export class TraceModule {}
