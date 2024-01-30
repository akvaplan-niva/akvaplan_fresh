// FIXME pressreleases add media
// FIXME Compare /en/press/2958380 with https://www.mynewsdesk.com/no/akvaplan-niva/pressreleases/ny-rapport-evaluering-av-nye-oppdrettsarter-2958380
//console.log("@todo News article: auto-fetch related contacts");

import { getValue } from "akvaplan_fresh/kv/mod.ts";

import {
  defaultImage,
  documentFilter,
  fetchContacts,
  fetchRelated,
  getItem,
  getItemBySlug,
  newsFilter,
  newsFromMynewsdesk,
  projectFilter,
  projectFromMynewsdesk,
  routesForLang,
} from "akvaplan_fresh/services/mod.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { isodate, longDate } from "akvaplan_fresh/time/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import {
  AlbumHeader,
  AltLangInfo,
  Article,
  ArticleHeader,
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import { AbstractMynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(no|en){/akvaplan-niva}?/:type(news|nyhet|blog|pressreleases|pressrelease|pressemelding){/:isodate}?/:slug",
};

interface ArticleProps {
  item: AbstractMynewsdeskItem;
  lang: string;
  alternate: Link;
  contacts: Person[];
  projects: AbstractMynewsdeskItem[];
  news: AbstractMynewsdeskItem[];
}

interface Link {
  href: URL;
  hreflang: string;
}

const typeOfMedia = (type: string) => {
  const _type = type.substring(0, 4).toLowerCase();
  switch (_type) {
    case "pres":
      return "pressrelease";
    case "blog":
      return "blog_post";
    default:
      return "news";
  }
};
const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
export const handler: Handlers = {
  async GET(req, ctx) {
    const { slug, lang, type } = ctx.params;
    langSignal.value = lang;
    const type_of_media = typeOfMedia(type);

    const numid = Number(slug?.split("-").at(-1));

    // Fetch item
    const item = (numid > 0)
      ? await getItem(numid, type_of_media)
      : await getItemBySlug(slug, type_of_media);
    if (!item) {
      return ctx.renderNotFound();
    }

    // Alternate language version?
    const href = item.links?.find(({ text }) => "alternate" === text)?.url;
    const hreflang = href ? new URL(href)?.pathname.substring(1, 3) : null;
    const alternate = href ? { href, hreflang } : null;

    // Fetch contacts
    item.links = item.links?.filter(({ text }) => "alternate" !== text);
    const contacts = await fetchContacts(item);

    // Related
    const related = await fetchRelated(item);
    const projects = related.filter(projectFilter).map((myn) =>
      projectFromMynewsdesk({ lang })(myn)
    );
    // const news = related.filter(newsFilter).map((myn) =>
    //   newsFromMynewsdesk({ lang })(myn)
    // );
    const documents = related.filter(documentFilter);
    return ctx.render({
      item,
      lang,
      contacts,
      alternate,
      projects,
      documents,
    });
  },
};

//console.log("@todo News article needs bullet points for <li> elements");

export default function NewsArticle(
  { data: { item, lang, contacts, alternate, projects, documents } }: PageProps<
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
    ...mynewsdeskItem
  } = item;

  //https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
  const img = image?.replace(",w_1782", ",w_1440,ar_16:9") ?? defaultImage;

  const __html = `<p style="font-size: 0.75rem">
  ${longDate(published_at.datetime, lang)} <a href="${
    routesForLang(lang).get("news")
  }">${t(`type.${type_of_media}`)}</a></p>${body ?? summary}`;

  const _caption = {
    fontSize: "0.75rem",
  };

  return (
    <Page title={header}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <script src={asset("/@nrk/core-scroll.min.js")} />
      </Head>
      <Article language={language}>
        <AltLangInfo lang={lang} language={language} alternate={alternate} />
        <ArticleHeader
          header={header}
          image={img}
          imageCaption={image_caption}
        />

        <section
          class="article-content"
          dangerouslySetInnerHTML={{ __html }}
        >
        </section>

        {documents?.length > 0
          ? (
            <section class="article-content">
              {documents?.map((item) => (
                <a
                  href={href({
                    ...item,
                    lang,
                    slug: item.url.split("/").at(-1),
                    collection: "document",
                  })}
                  target="_blank"
                >
                  <figure style={{ fontSize: "0.75rem" }}>
                    <img
                      title={item.header}
                      alt={item.header}
                      src={String(item.document_thumbnail)}
                    />
                    <figcaption>{item.summary}</figcaption>
                  </figure>
                </a>
              ))}
            </section>
          )
          : null}

        {projects?.length > 0 && (
          <section style={_section}>
            <AlbumHeader
              text={t("ui.Read_more")}
            />
            <HScroll maxVisibleChildren={5.5}>
              {projects.map(ArticleSquare)}
            </HScroll>
          </section>
        )}

        {
          /* {news?.length > 0 && (
          <section style={_section}>
            <AlbumHeader
              text={t("nav.News")}
            />
            <HScroll maxVisibleChildren={5.5}>
              {news.map(ArticleSquare)}
            </HScroll>
          </section>
        )} */
        }

        {(links && links?.length > 0) &&
          (
            <section class="article-content">
              {links?.map(({ url, text }) => (
                <Card>
                  <a href={url} class="ellipsis">{text ?? url}</a>
                </Card>
              ))}
            </section>
          )}

        <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem;">
          {contacts && contacts.map(
            (contact) => (
              <section class="article-content">
                <PersonCard id={contact} icons={false} />
              </section>
            ),
          )}
        </li>

        <LinkBackToCollection collection={"news"} lang={lang} />
      </Article>
    </Page>
  );
}
