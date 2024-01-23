export interface MynewsdeskItem {
  header: string;
  summary?: string;
  caption?: string;
  newsdeskML?: string;
  type_of_media: string;
  language?: string;
  source_id?: number;
  source_name?: string;
  pressroom_name?: string;
  pressroom?: string;
  pressroom_id?: number;
  organization_number?: string;
  id?: number;
  url: string;
  published_at: At;
  created_at?: At;
  updated_at?: At;
  links: unknown[];
  image_caption?: null;
  image?: string;
  image_small?: string;
  image_medium?: string;
  image_thumbnail_large?: string;
  image_thumbnail_medium?: string;
  image_thumbnail_small?: string;
  tags: unknown[];
}

export interface MynewsdeskDocument extends MynewsdeskItem {
  document: string;
  document_format: string;
}

export interface MynewsdeskVideo extends MynewsdeskDocument {
  embed: string;
  video_url: string;
  embed_code: string;
}

export interface MynewsdeskImage extends MynewsdeskItem {
  position: number;
  photographer: string;

  tags: Tag[];
  related_items: unknown[];

  image_name: string;
  image_format: string;
  image_size: number;
  image_dimensions: string;
  image_license: string;
  download_url: string;
}

export interface Tag {
  name: string;
}

export interface At {
  text?: string;
  datetime: Date;
}
