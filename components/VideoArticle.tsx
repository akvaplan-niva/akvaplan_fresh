import { Article } from "akvaplan_fresh/components/mod.ts";
import type { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

export function VideoArticle(
  { item }: { item: MynewsdeskVideo },
) {
  return (
    <Article>
      <div style="position:relative;width:100%;padding-bottom:56.25%;">
        <iframe
          allow="autoplay; fullscreen"
          allowFullScreen
          referrerpolicy="no-referrer-when-downgrade"
          src={`https://api.screen9.com/embed/${item.embed}`}
          style="border:0;width:100%;height:100%;position:absolute"
          title=""
        >
        </iframe>
      </div>
    </Article>
  );
}
