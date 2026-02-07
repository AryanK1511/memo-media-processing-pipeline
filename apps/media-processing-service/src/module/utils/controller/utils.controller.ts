import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@Controller("api/v1/utils")
export class UtilsController {
	@Get("supported-versions")
	@HttpCode(HttpStatus.OK)
	async getVersion() {
		return {
			min_supported_version: "1.0.0",
			latest_version: "1.0.0",
			cache_response_duration: 0,
		};
	}

	@Get("health")
	@HttpCode(HttpStatus.OK)
	health() {
		return {
			status: "ok",
		};
	}

	@Get("feature-flags")
	@HttpCode(HttpStatus.OK)
	featureFlags() {
		return {
			feature_flags: [],
		};
	}
}
