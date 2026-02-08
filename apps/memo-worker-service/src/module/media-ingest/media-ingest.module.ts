import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MediaDownloaderService } from "./downstream/ytdlp/media-downloader.service";
import { MediaIngestProcessor } from "./processor/media-ingest.processor";
import { MediaIngestService } from "./service/media-ingest.service";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "media-ingest",
			defaultJobOptions: { removeOnComplete: true },
		}),
	],
	providers: [MediaDownloaderService, MediaIngestService, MediaIngestProcessor],
})
export class MediaIngestModule {}
