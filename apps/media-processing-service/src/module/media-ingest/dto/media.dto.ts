import { IsEnum, IsUrl } from "class-validator";

export enum CONTENT_ORIGINATION {
  INSTAGRAM = "INSTAGRAM",
  TIKTOK = "TIKTOK",
  YOUTUBE = "YOUTUBE",
}

export type ContentOrigination = `${CONTENT_ORIGINATION}`;

export class CreateMediaDto {
  @IsUrl()
  url: string;

  @IsEnum(CONTENT_ORIGINATION)
  origination: ContentOrigination;
}
