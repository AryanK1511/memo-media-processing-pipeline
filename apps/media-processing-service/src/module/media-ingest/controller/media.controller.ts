import { InjectQueue } from "@nestjs/bullmq";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import type { Queue } from "bullmq";
import { makeSuccessResponse } from "../../../helper-module/common/response-helpers";
import { CreateMediaDto } from "../dto/media.dto";

@Controller("api/v1/media")
export class MediaController {
  constructor(
    @InjectQueue("media-ingest") private readonly mediaIngestQueue: Queue
  ) {}

  @Post("ingest")
  @HttpCode(HttpStatus.OK)
  async ingest(@Body() body: CreateMediaDto) {
    const job = await this.mediaIngestQueue.add("test-job", body);
    return makeSuccessResponse({ jobId: job.id });
  }
}
