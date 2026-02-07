import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn", "log"],
  });
  Logger.log("Media worker started");
}

bootstrap();
