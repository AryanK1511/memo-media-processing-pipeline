import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import type { Job } from "bullmq";

@Processor("media-ingest")
export class MediaIngestProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaIngestProcessor.name);

  async process(job: Job) {
    this.logger.log(
      `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`
    );
    return {};
  }
}
