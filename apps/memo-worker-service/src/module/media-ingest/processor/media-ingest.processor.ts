import { Logger } from "@nestjs/common";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import type { Job } from "bullmq";

@Processor("media-ingest")
export class MediaIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaIngestProcessor.name);

  async process(job: Job): Promise<void> {
    this.logger.log(
      `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`
    );
  }
}
