import { existsSync, mkdirSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import ytdlp from "yt-dlp-exec";
import type {
	ContentOrigination,
	ProcessingContext,
} from "../../media-ingest.types";

@Injectable()
export class MediaDownloaderService {
	private readonly logger = new Logger(MediaDownloaderService.name);
	private readonly downloadDir: string;

	constructor() {
		this.downloadDir = join(process.cwd(), "downloads");
		this.ensureDownloadDir();
	}

	async downloadContent(
		context: ProcessingContext,
	): Promise<ProcessingContext> {
		try {
			const outputTemplate = join(
				this.downloadDir,
				`${context.origination}-${context.timestamp}-%(id)s.%(ext)s`,
			);

			const options: Record<string, unknown> = {
				output: outputTemplate,
				noPlaylist: true,
				writeInfoJson: true,
				writeSubs: true,
				writeAutoSubs: true,
				writeComments: true,
				writeThumbnail: true,
				ignoreErrors: true,
				jsRuntimes: "node",
			};

			if (context.origination === "instagram") {
				options.format = "best";
			} else if (context.origination === "tiktok") {
				options.format = "best";
			} else if (context.origination === "youtube") {
				options.format = "bestvideo+bestaudio/best";
			}

			await ytdlp(context.url, options);

			const files = await this.findDownloadedFile(
				context.timestamp,
				context.origination,
			);

			if (files.length === 0) {
				this.logger.error(
					"Download completed but no file was found",
					`${MediaDownloaderService.name}-downloadContent`,
				);
				throw new Error("Download completed but no file was found");
			}

			const videoFiles = files.filter((file) => {
				const ext = extname(file).toLowerCase();
				return ![
					".json",
					".vtt",
					".srt",
					".lrc",
					".chat",
					".jpg",
					".jpeg",
					".png",
					".webp",
					".description",
					".xml",
				].includes(ext);
			});

			if (videoFiles.length === 0) {
				this.logger.error(
					"Download completed but no video file was found",
					`${MediaDownloaderService.name}-downloadContent`,
				);
				throw new Error("Download completed but no video file was found");
			}

			const filePath = videoFiles[0];
			const fileStats = await stat(filePath);
			const extension = extname(filePath).slice(1);

			const metadata = await this.parseInfoJson(files);

			const extractedTags = this.extractHashtagsFromSources(
				metadata.caption,
				metadata.tags,
			);

			this.logger.log(
				`Extracted ${extractedTags.length} tags from description and metadata`,
				`${MediaDownloaderService.name}-downloadContent`,
			);

			const creator = metadata.creator
				? {
						id: metadata.creator.id || "",
						source: context.origination,
						name: metadata.creator.name || "",
						description: metadata.creator.description || "",
					}
				: undefined;

			return {
				...context,
				videoFile: {
					path: filePath,
					size: fileStats.size,
					extension,
				},
				media: {
					...context.media,
					creator,
					caption: metadata.caption,
					tags: extractedTags,
				},
			};
		} catch (error) {
			this.logger.error(
				`Failed to download content from ${context.url}`,
				`${MediaDownloaderService.name}-downloadContent`,
			);
			throw error;
		}
	}

	private async findDownloadedFile(
		timestamp: number,
		origination: ContentOrigination,
	): Promise<string[]> {
		try {
			const files = await readdir(this.downloadDir);
			const prefix = `${origination}-${timestamp}-`;
			return files
				.filter((file) => file.startsWith(prefix))
				.map((file) => join(this.downloadDir, file));
		} catch (error) {
			this.logger.error(
				`Failed to find downloaded file: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
				`${MediaDownloaderService.name}-findDownloadedFile`,
			);
			return [];
		}
	}

	private async parseInfoJson(files: string[]): Promise<{
		creator?: { id: string; name: string; description: string };
		caption?: string;
		tags?: string[];
	}> {
		try {
			const infoJsonFile = files.find((file) => file.endsWith(".info.json"));
			if (!infoJsonFile) {
				return {};
			}
			const content = await readFile(infoJsonFile, "utf-8");
			const info = JSON.parse(content);
			return {
				creator: {
					id: info.uploader_id || "",
					name: info.uploader || info.channel || "",
					description: info.description || info.title || "",
				},
				caption: info.description || info.title || "",
				tags: info.tags || [],
			};
		} catch (error) {
			this.logger.error(
				`Failed to parse info.json: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
				`${MediaDownloaderService.name}-parseInfoJson`,
			);
			return {};
		}
	}

	private extractHashtags(text: string): string[] {
		if (!text) return [];
		const hashtagRegex = /(?:^|\s)#([a-zA-Z0-9_-]+)/g;
		const matches = text.matchAll(hashtagRegex);
		const hashtags = new Set<string>();
		for (const match of matches) {
			const tag = match[1].toLowerCase();
			if (tag.length > 0) hashtags.add(tag);
		}
		return Array.from(hashtags);
	}

	private extractHashtagsFromSources(
		caption?: string,
		existingTags?: string[],
	): string[] {
		const allTags = new Set<string>();
		if (existingTags?.length) {
			existingTags.forEach((tag) => {
				const normalizedTag = tag.replace(/^#/, "").toLowerCase();
				if (normalizedTag.length > 0) allTags.add(normalizedTag);
			});
		}
		if (caption) {
			for (const tag of this.extractHashtags(caption)) allTags.add(tag);
		}
		return Array.from(allTags);
	}

	private ensureDownloadDir(): void {
		try {
			if (!existsSync(this.downloadDir)) {
				mkdirSync(this.downloadDir, { recursive: true });
			}
		} catch (error) {
			this.logger.error(
				`Failed to create download directory: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
				`${MediaDownloaderService.name}-ensureDownloadDir`,
			);
		}
	}
}
