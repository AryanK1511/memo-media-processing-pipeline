import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TraceModule } from "../trace/trace.module";

@Module({
	imports: [TraceModule, MongooseModule.forFeature([])],
	providers: [],
	exports: [MongooseModule],
})
export class DatabaseModule {}
