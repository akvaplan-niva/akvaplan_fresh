import { PanelIntl } from "akvaplan_fresh/components/panel.tsx";

export interface Panel {
  id: string;
  collection: string;
  theme?: string;
  backdrop?: boolean;
  image: PanelImage;
  intl: {
    [lang: string]: PanelIntl;
  };
  title: string;
  href: string;
  intro: string;
  cta: string;
}

export interface PanelImage {
  url: string;
  cloudinary: string;
}

export interface PanelIntl {
  title: string;
  href: string;
  intro: string;
  cta: string;
}
