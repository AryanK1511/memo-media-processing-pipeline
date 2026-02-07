import { Module } from "@nestjs/common";
import { UtilsController } from "./controller/utils.controller";

@Module({
	controllers: [UtilsController],
})
export class UtilsModule {}
