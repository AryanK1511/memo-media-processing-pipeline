import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MediaIngestModule } from "./module/media-ingest/media-ingest.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				connection: { url: configService.get<string>("REDIS_URL") },
			}),
			inject: [ConfigService],
		}),
		MediaIngestModule,
	],
})
export class AppModule {}
