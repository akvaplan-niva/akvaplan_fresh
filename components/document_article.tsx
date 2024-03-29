import { isodate } from "akvaplan_fresh/time/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

import { Article } from "akvaplan_fresh/components/mod.ts";
import Button from "akvaplan_fresh/components/button/button.tsx";

import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

const previewImageUrl = (cloudinary: string, width: number) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_${width}/${cloudinary}`;

export function DocumentArticle(
  { item, lang }: {
    item: MynewsdeskDocument & { download: string; cloudinary: string };
    lang: string;
  },
) {
  return (
    <Article>
      <header>
        <h1>
          {item.header}
        </h1>
        <a
          href={item.download}
          target="_blank"
        >
          <figure>
            <img
              title={item.header}
              alt={item.header}
              src={previewImageUrl(item.cloudinary, 375)}
            />
          </figure>
        </a>
      </header>

      <p>{item.summary}</p>

      <dl>
        <dt>{t("ui.Published")}</dt>
        <dd>{isodate(item?.published_at?.datetime)}</dd>
      </dl>

      <Button filled>
        <a
          target="_blank"
          href={item.download}
        >
          {t("ui.Download")}
        </a>
      </Button>

      <LinkBackToCollection collection={"documents"} lang={lang} />
    </Article>
  );
}
