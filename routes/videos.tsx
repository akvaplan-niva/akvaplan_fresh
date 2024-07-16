import { openKv } from "akvaplan_fresh/kv/mod.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { ArticleSquare, Page } from "akvaplan_fresh/components/mod.ts";
import { type InternationalProps } from "akvaplan_fresh/utils/page/international_page.ts";

interface VideosProps extends InternationalProps {
  videos: MynewsdeskItem[];
}

import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { videoURL } from "akvaplan_fresh/services/nav.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(videos|video)",
};

export const handler: Handlers<VideosProps> = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("our.video");
    const kv = await openKv();

    const _vid = [];
    for await (
      const { key, value } of kv.list<MynewsdeskItem & { href: string }>({
        prefix: ["mynewsdesk_id", "video"],
      })
    ) {
      const slug = value.url.replace("https://akvaplan.no/videos/", "");
      const href = videoURL({ lang: params.lang, slug });
      value.href = href;
      _vid.push(value);
    }
    const videos = _vid.sort((a, b) =>
      new Date(a.published_at?.datetime) <
          new Date(b.published_at?.datetime)
        ? 1
        : -1
    );

    return ctx.render({ title, base, videos, lang });
  },
};

export default function Videos(
  { data: { title, lang, base, videos } }: PageProps<VideosProps>,
) {
  return (
    <Page title={title} base={base} lang={lang}>
      <h1 class="mega-heading">{title}</h1>
      <main
        style={{
          display: "grid",
          gap: "1rem",
          marginBlockStart: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {videos.map((v) => (
          <ArticleSquare
            title={v.header}
            img={v.thumbnail}
            published={v.published_at.datetime}
            href={v.href}
            width="320"
            height="320"
            maxWidth="320px"
          />
        ))}
      </main>
    </Page>
  );
}
