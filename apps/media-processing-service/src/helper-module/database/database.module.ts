import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TraceModule } from "../trace/trace.module";
import {} from "./repository/media.repository";

@Module({
	imports: [TraceModule, MongooseModule.forFeature([])],
	providers: [],
	exports: [MongooseModule],
})
export class DatabaseModule {}
