import { Article } from "akvaplan_fresh/components/article/Article.tsx";
import type { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { editHref } from "akvaplan_fresh/services/mynewsdesk.ts";
import { EditLinkIcon } from "akvaplan_fresh/components/edit_link.tsx";

export function VideoArticle(
  { item }: { item: MynewsdeskVideo },
) {
  return (
    <Article>
      <div style="position:relative;width:100%;padding-bottom:56.25%;">
        {item?.embed && (
          <iframe
            allow="autoplay; fullscreen"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
            src={`https://api.screen9.com/embed/${item.embed}?starttime=0`}
            style="border:0;width:100%;height:100%;position:absolute"
            title=""
          >
          </iframe>
        )}
      </div>
      <EditLinkIcon href={editHref(item)} />
    </Article>
  );
}
