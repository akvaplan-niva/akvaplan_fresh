export interface AbstractMynewsdeskItem {
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
  id: number;
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
  related_items: RelatedItem[];
}

export interface MynewsdeskArticle extends AbstractMynewsdeskItem {
  body: string;
}

interface RelatedItem {
  type_of_media: string;
  item_id: number;
}

export interface MynewsdeskDocument extends AbstractMynewsdeskItem {
  document: string; // URL
  document_name: string;
  document_format: string;
  document_size: number;
  document_thumbnail: string;
}

export interface MynewsdeskVideo extends MynewsdeskDocument {
  embed: string;
  video_url: string;
  embed_code: string;
}

export interface MynewsdeskEvent extends AbstractMynewsdeskItem {
  end: Date;
  start: Date | string;
}

export interface MynewsdeskImage extends AbstractMynewsdeskItem {
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
