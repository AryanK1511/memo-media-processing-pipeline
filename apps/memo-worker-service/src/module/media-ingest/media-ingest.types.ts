export type ContentOrigination = "youtube" | "tiktok" | "instagram";

export interface ProcessingContext {
	timestamp: number;
	url: string;
	origination: ContentOrigination;
	userId: string;
	videoFile?: {
		path: string;
		size: number;
		extension: string;
	};
	media?: {
		caption?: string;
		tags?: string[];
		creator?: {
			id: string;
			source: string;
			name: string;
			description: string;
		};
	};
}
