import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MediaIngestProcessor } from "./processor/media-ingest.processor";

@Module({
  imports: [BullModule.registerQueue({ name: "media-ingest" })],
  providers: [MediaIngestProcessor],
})
export class MediaIngestWorkerModule {}
