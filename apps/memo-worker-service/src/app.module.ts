import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MediaIngestWorkerModule } from "./module/media-ingest/media-ingest-worker.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: { url: configService.get<string>("REDIS_URL") },
      }),
      inject: [ConfigService],
    }),
    MediaIngestWorkerModule,
  ],
})
export class AppModule {}
