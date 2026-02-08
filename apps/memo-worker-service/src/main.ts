import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
	await NestFactory.createApplicationContext(AppModule);
	const logger = new Logger("Bootstrap");
	logger.log("Memo Worker Service started");
}

bootstrap();
