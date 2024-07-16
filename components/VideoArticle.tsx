import { Article } from "akvaplan_fresh/components/article/Article.tsx";
import type { MynewsdeskVideo } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { editHref } from "akvaplan_fresh/services/mynewsdesk.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

export function VideoArticle(
  { item, editor }: { item: MynewsdeskVideo },
) {
  return (
    <>
      <Section>
        <Card>
          <h1>{item.header}</h1>
        </Card>
      </Section>
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

      <p>{item.summary}</p>

      <dl>
        <dt>Publisert/Published</dt>
        <dd>{isodate(item.published_at.datetime)}</dd>
        <dt>Lengde/Duration</dt>
        <dd>{item.duration}</dd>
      </dl>
    </>
  );
}
