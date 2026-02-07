import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MediaIngestProcessor } from "./processor/media-ingest.processor";

@Module({
  imports: [
      BullModule.registerQueue({
        name: "media-ingest",
        defaultJobOptions: { removeOnComplete: true },
      }),
    ],
  providers: [MediaIngestProcessor],
})
export class MediaIngestWorkerModule {}
