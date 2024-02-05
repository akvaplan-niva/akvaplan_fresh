import { intlRouteMap as intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

import { Article, Icon, MiniNewsCard } from "akvaplan_fresh/components/mod.ts";
import Button from "akvaplan_fresh/components/button/button.tsx";

import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { newsFilter } from "akvaplan_fresh/services/mod.ts";
import { MynewsdeskArticle } from "akvaplan_fresh/@interfaces/mod.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

const w1782Preview = (cloudinary: string) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782/${cloudinary}`;

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
              src={w1782Preview(item.cloudinary)}
            />

            {/* <figcaption>{item.photographer}</figcaption> */}
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
