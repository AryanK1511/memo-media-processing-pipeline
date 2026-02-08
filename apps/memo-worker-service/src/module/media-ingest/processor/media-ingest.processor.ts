import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import type { Job } from "bullmq";
import { MEDIA_INGEST_CONCURRENCY } from "../../../app.constants";
import type {
	ContentOrigination,
	ProcessingContext,
} from "../media-ingest.types";
import { MediaIngestService } from "../service/media-ingest.service";

@Processor("media-ingest", { concurrency: MEDIA_INGEST_CONCURRENCY })
export class MediaIngestProcessor extends WorkerHost {
	private readonly logger = new Logger(MediaIngestProcessor.name);

	constructor(private readonly mediaIngestService: MediaIngestService) {
		super();
	}

	async process(job: Job): Promise<void> {
		this.logger.log(
			`Processing job ${job.id} with data: ${JSON.stringify(job.data)}`,
		);
		const data = job.data as {
			url: string;
			origination: ContentOrigination;
			userId: string;
		};

		const context: ProcessingContext = {
			timestamp: Date.now(),
			url: data.url,
			origination: data.origination,
			userId: data.userId,
		};

		await this.mediaIngestService.processContent(context);
		this.logger.log(`Job ${job.id} completed`);
	}
}
