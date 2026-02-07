import { InjectQueue } from "@nestjs/bullmq";
import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { Queue } from "bullmq";
import { makeSuccessResponse } from "../../../helper-module/common/response-helpers";

@Controller("api/v1/media")
export class MediaController {
  constructor(
    @InjectQueue("media-ingest") private readonly mediaIngestQueue: Queue
  ) {}

  @Post("ingest")
  @HttpCode(HttpStatus.OK)
  async ingest() {
    const job = await this.mediaIngestQueue.add("test-job", { test: true });
    return makeSuccessResponse({ jobId: job.id });
  }
}
