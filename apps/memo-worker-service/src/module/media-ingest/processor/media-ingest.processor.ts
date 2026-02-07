import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import type { Job } from "bullmq";
import { MEDIA_INGEST_CONCURRENCY } from "../constants";

@Processor("media-ingest", { concurrency: MEDIA_INGEST_CONCURRENCY })
export class MediaIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaIngestProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(
      `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`
    );

    await new Promise((resolve) => setTimeout(resolve, 5000));
    this.logger.log(`Job ${job.id} completed`);
  }
}
