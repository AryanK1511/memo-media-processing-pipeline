import { Injectable } from "@nestjs/common";
import { MediaDownloaderService } from "../downstream/ytdlp/media-downloader.service";
import type { ProcessingContext } from "../media-ingest.types";

@Injectable()
export class MediaIngestService {
	constructor(
		private readonly mediaDownloaderService: MediaDownloaderService,
	) {}

	private readonly processingSteps: Array<
		(context: ProcessingContext) => Promise<ProcessingContext>
	> = [
		this.mediaDownloaderService.downloadContent.bind(
			this.mediaDownloaderService,
		),
	];

	async processContent(context: ProcessingContext): Promise<ProcessingContext> {
		let currentContext = context;
		for (const step of this.processingSteps) {
			currentContext = await step(currentContext);
		}
		return currentContext;
	}
}
