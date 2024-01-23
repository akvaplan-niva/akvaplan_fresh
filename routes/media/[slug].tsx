import { getItem } from "akvaplan_fresh/services/mynewsdesk.ts";

import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";

import { Article, Icon, Page } from "akvaplan_fresh/components/mod.ts";

import type { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import type { Handlers, RouteConfig } from "$fresh/server.ts";
import { imagesURL } from "akvaplan_fresh/services/nav.ts";
import { openKv } from "akvaplan_fresh/kv/mod.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(image|bilde|media|video)/:slug",
};
const typeOfMedia = new Map([
  ["bilde", "image"],
]);
export const handler: Handlers = {
  async GET(req, ctx) {
    const { params: { slug, type, lang } } = ctx;
    if ("objozvs9edrhlhtd35uh" === slug) {
    } else if (/-[0-9]+$/.test(slug)) {
      const numid = Number(slug.split("-").at(-1));
      const type_of_media = typeOfMedia.get(type) ?? type;
      const item = await getItem(numid, type_of_media);
      if (!item) {
        throw new Deno.errors.NotFound();
      }
      switch (item.type_of_media) {
        case "image": {
          return ctx.render({ item, type, lang });
        }
        case "video": {
          const kv = await openKv();
          const videokey = ["mynewsdesk_video_embed", slug];
          const { value } = await kv.get(videokey);
          return ctx.render({ item, type, lang, embed: value });
        }
      }
    }
    throw new Deno.errors.NotFound();
  },
};

export function ImageArticle({ item }: { item: MynewsdeskImage }) {
  return (
    <Article language={lang}>
      <header>
        <a href={item.image} target="_blank">
          <img
            title={item.header}
            alt={item.header}
            src={item.image_medium}
          />
        </a>
        <h1>
          {item.header}
        </h1>
      </header>
      <figure>
        <figcaption>{item.photographer}</figcaption>
      </figure>

      <dl>
        <dt>Published</dt>
        <dd>{isodate(item.published_at.datetime)}</dd>
        <dt>Dimensions</dt>
        <dd>{item.image_dimensions}</dd>
        <dt>Size (bytes)</dt>
        <dd>{item.image_size}</dd>
        <dt>Original</dt>
        <dd>
          <a download href={item.download_url}>{item.image_name}</a>
        </dd>
      </dl>
      <div
        style={{ marginBlockStart: "0.5rem", fontSize: "var(--font-size-4)" }}
      >
        <Icon
          name={"arrow_back_ios_new"}
          style={{ color: "var(--accent)" }}
          width="1rem"
          height="1rem"
        />{" "}
        <a
          href={imagesURL({ lang })}
          style={{ color: "var(--text1)" }}
        >
          {t("nav.Images")}
          {" "}
        </a>
      </div>
    </Article>
  );
}

export function VideoArticle(
  { item, embed }: { item: MynewsdeskVideo; embed: string },
) {
  // Mynewsdesk API expose a low-quality 360p URL
  // http://localhost:7777/no/video/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => https://bcdn.screen9.com/ovh/production/media/5/J/5JEdizmlD23NsS93LZCsvg_360p_h264h.mp4?token=…
  // While they use a 720p higher quality
  // https://akvaplan-niva.mynewsdesk.com/videos/miljoeovervaaking-akvakultur-paa-akvaplan-niva-118873 => svg_720p_hls
  const video_url = item.video_url; //.replace("svg_360p", "svg_720p");

  return (
    <Article language={lang}>
      <div style="position:relative;width:100%;padding-bottom:56.25%;">
        <iframe
          allow="autoplay; fullscreen"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
          src={`https://api.screen9.com/embed/${embed}`}
          style="border:0;width:100%;height:100%;position:absolute"
          title=""
        >
        </iframe>
      </div>
    </Article>
  );
}

export default function MediaPreview({ data }) {
  const { item, embed } = data;

  const { image, header, photographer, image_size, ...meta } = item;
  return (
    <Page title={""}>
      {"image" === item.type_of_media && <ImageArticle item={item} />}
      {"video" === item.type_of_media && (
        <VideoArticle item={item} embed={embed} />
      )}
    </Page>
  );
}
