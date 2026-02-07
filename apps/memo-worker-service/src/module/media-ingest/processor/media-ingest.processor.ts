import { Processor, WorkerHost } from "@nestjs/bullmq";
import type { Job } from "bullmq";
import { WorkerLogger } from "../../../logger.service";

@Processor("media-ingest")
export class MediaIngestProcessor extends WorkerHost {
  constructor(private readonly logger: WorkerLogger) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(
      `Processing job ${job.id} with data: ${JSON.stringify(job.data)}`,
      MediaIngestProcessor.name
    );
  }
}
