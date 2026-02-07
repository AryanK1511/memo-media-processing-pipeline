import { InjectQueue } from "@nestjs/bullmq";
import { Controller, HttpStatus, Post } from "@nestjs/common";
import type { Queue } from "bullmq";
import {
  makeErrorResponse,
  makeSuccessResponse,
} from "../../../helper-module/common/response-helpers";

@Controller("api/v1/media")
export class MediaController {
  constructor(@InjectQueue("media-ingest") private readonly queue: Queue) {}

  @Post("ingest")
  async ingest() {
    try {
      const job = await this.queue.add("test-job", { timestamp: Date.now() });
      return makeSuccessResponse({ jobId: job.id }, "Job queued successfully");
    } catch (_error) {
      throw makeErrorResponse(
        "Failed to queue job",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
