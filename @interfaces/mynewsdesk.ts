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

export interface MynewsdeskImage {
  newsdeskML: string;
  type_of_media: string;
  language: string;
  source_id: number;
  source_name: string;
  pressroom_name: string;
  pressroom: string;
  pressroom_id: number;
  organization_number: string;
  id: number;
  url: string;
  published_at: At;
  created_at: At;
  updated_at: At;
  position: number;
  links: unknown[];
  header: string;
  summary: null;
  photographer: string;
  image_name: string;
  image_format: string;
  image_size: number;
  image_dimensions: string;
  image_license: string;
  image: string;
  download_url: string;
  image_small: string;
  image_medium: string;
  image_thumbnail_large: string;
  image_thumbnail_medium: string;
  image_thumbnail_small: string;
  tags: Tag[];
  related_items: unknown[];
}

export interface Tag {
  name: string;
}

export interface At {
  text?: string;
  datetime: Date;
}
