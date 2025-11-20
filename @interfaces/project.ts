export type ProjectLifecycle = "ongoing" | "past" | "future";
export interface Project {
  id: string;
  abbr?: string;
  start: string;
  end: string;
  cloudinary: string;
  mynewsdesk?: number;
  cristin?: number;
  rcn?: number;
  akvaplanists: string[];
  lifecycle: ProjectLifecycle;
  title: {
    en: string;
    no: string;
  };
  published?: Date;
  updated?: Date;
}
