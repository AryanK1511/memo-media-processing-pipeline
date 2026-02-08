import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { MediaController } from "./controller/media.controller";

@Module({
	imports: [
		BullModule.registerQueue({
			name: "media-ingest",
			defaultJobOptions: { removeOnComplete: true },
		}),
	],
	controllers: [MediaController],
})
export class MediaModule {}
