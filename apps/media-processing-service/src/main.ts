import {
  BadRequestException,
  type INestApplication,
  Logger,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { Request, Response } from "express";
import actuator from "express-actuator";
import helmet from "helmet";
import morgan from "morgan";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === "PROD",
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        Logger.warn(
          errors.map((error) => {
            while (
              !error.constraints &&
              error.children &&
              error.children.length
            ) {
              error = error.children[0];
            }
            return `[validation error] | error = ${JSON.stringify(
              error.constraints
            )} | object = ${JSON.stringify(error.target)}`;
          })
        );
        return new BadRequestException();
      },
    })
  );

  configure(app);
  await app.listen(process.env.PORT ?? 3000);
}

function configure(app: INestApplication) {
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001", // Default to frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });
  app.use(actuator()); // for /health and /info routes.
  app.use(helmet()); // for various security improvements.

  // Custom Morgan token for trace ID
  morgan.token("trace-id", (_req: Request, res: Response) => {
    return (res.getHeader("x-Trace-Id") as string) || "no-trace-id";
  });

  app.use(
    morgan(
      '[:trace-id] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      {
        skip: (req: Request) => req.url === "/health" || req.url === "/info",
      }
    )
  );
}

bootstrap();
