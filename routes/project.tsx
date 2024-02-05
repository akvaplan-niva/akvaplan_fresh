import {
  defaultImage,
  fetchContacts,
  fetchImages,
  getCanonical,
  getItem,
  getItemBySlug,
  multiSearchMynewsdesk,
  newsFromMynewsdesk,
  projectMap,
  projectYears,
} from "akvaplan_fresh/services/mod.ts";

import { isodate, normalize } from "akvaplan_fresh/utils/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";

import type { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

import {
  AlsoInNative,
  AltLangInfo,
  Article,
  ArticleContact,
  ArticleHeader,
  ArticleSquare,
  Card,
  HScroll,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PeopleCard as PersonCard } from "akvaplan_fresh/components/mod.ts";
import { intlRouteMap } from "../services/nav.ts";

import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt){/:date}?/:slug",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { slug, lang, type } = ctx.params;
    langSignal.value = lang;

    const numid = Number(slug?.split("-").at(-1));
    const item = (Number(numid) > 0)
      ? await getItem(numid, "event")
      : await getItemBySlug(slug, "event");

    if (!item) {
      return ctx.renderNotFound();
    }

    // if (["project", "prosjekt"].includes(type) && "no" === lang) {
    //   item.header = t(`project.${slug}.title`);
    // }
    const contacts = await fetchContacts(item);
    const [image] = await fetchImages(item);
    item.image_caption = item.image_caption ?? image.header;

    let { searchwords, logo, exclude } = projectMap.get(slug) ?? {};

    searchwords = [...new Set([...searchwords ?? [], slug].map(normalize))];
    const regex = searchwords.join("|");
    const needle = new RegExp(normalize(regex), "ui");

    const _news = await multiSearchMynewsdesk(
      searchwords,
      ["news", "pressrelease", "blog_post"],
      { limit: 64 },
    ) ?? [];
    const _matching = _news.filter((news) => {
      if (exclude?.some(({ id }) => id === news.id)) {
        return false;
      }
      return needle.test(normalize(JSON.stringify(news)));
    });
    const news = _matching?.map(newsFromMynewsdesk({ lang }));

    const alternate = null;

    // const kv = await openKv();
    // const news = [];
    // for await (
    //   const { value } of kv.list({ prefix: ["rel", "project", item.id] }, {
    //     reverse: true,
    //   })
    // ) {
    //   const href = getCanonical({
    //     lang,
    //     title: value.title,
    //     type_of_media: value.collection,
    //     url: req.url,
    //   });
    //   const relLocalized = { ...value, href };
    //   news.push(relLocalized);
    // }

    return ctx.render({ item, lang, logo, news, contacts, alternate });
  },
};

interface ArticleProps {
  item: MynewsdeskItem;
  lang: string;
}

export default function ProjectHome(
  { data: { item, lang, news, contacts, logo, alternate } }: PageProps<
    ArticleProps
  >,
) {
  const {
    header,
    image,
    // image_small,
    // image_medium,
    image_thumbnail_large,
    // image_thumbnail_medium,
    // image_thumbnail_small,
    contact_people,
    image_caption,
    related_items,
    type_of_media,
    published_at,
    updated_at,
    created_at,
    links,
    summary,
    tags,
    url,
    language,
    body,
    start_at,
    end_at,
    ...mynewsdeskItem
  } = item;

  //https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
  const img = image; //?.replace(",w_1782", ",w_1600,ar_16:9") ?? defaultImage;

  const published = isodate(published_at.datetime);

  const __html = body ?? summary;

  const _caption = {
    fontSize: "0.75rem",
  };

  const title = (
    <span>
      <a href={intlRouteMap(lang).get("projects")}>{t(`nav.Projects`)}</a>:{" "}
      {header} ({projectYears(start_at, end_at)})
    </span>
  );

  return (
    <Page title={header}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
      <h1>
        {title}
      </h1>
      <figure style={_caption}>
        {logo && (
          <p>
            <img
              alt="project logo"
              width="350"
              height="auto"
              src={logo}
            />
          </p>
        )}
      </figure>
      <HScroll maxVisibleChildren={5.5}>
        {news.map(ArticleSquare)}
      </HScroll>

      <Article language={language}>
        <AltLangInfo lang={lang} language={language} alternate={alternate} />
        <ArticleHeader
          header={`${header} (${projectYears(start_at, end_at)})`}
          image={img}
          imageCaption={image_caption}
        />

        <section
          class="article-content"
          dangerouslySetInnerHTML={{ __html }}
        >
        </section>

        {(links && links?.length > 0) &&
          (
            <section class="article-content">
              {links?.map(({ url }) => (
                <Card>
                  <a href={url} class="ellipsis">{url}</a>
                </Card>
              ))}
            </section>
          )}

        <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(440px, 1fr));grid-gap:1rem;">
          {contacts && contacts.map(
            (contact) => (
              <section class="article-content">
                <PersonCard id={contact} icons={false} />
              </section>
            ),
          )}
        </li>
        <LinkBackToCollection collection={"projects"} lang={lang} />
      </Article>
    </Page>
  );
}
