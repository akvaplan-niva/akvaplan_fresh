import {
  defaultImage,
  documentFilter,
  intlRouteMap,
  newsFromMynewsdesk,
  projectFilter,
  projectFromMynewsdesk,
  videoFilter,
} from "akvaplan_fresh/services/mod.ts";

import {
  editHref,
  fetchContacts,
  fetchRelated,
  getItem,
  getItemBySlug,
  imageFilter,
  searchMynewsdesk,
} from "akvaplan_fresh/services/mynewsdesk.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { longDate } from "akvaplan_fresh/time/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import {
  AltLangInfo,
  Article,
  ArticleHeader,
  ArticleSquare,
  Card,
  CollectionHeader,
  HScroll,
  Icon,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import {
  AbstractMynewsdeskItem,
  MynewsdeskArticle,
} from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

import { getVideo } from "akvaplan_fresh/kv/video.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticle.tsx";
import { EditLinkIcon } from "akvaplan_fresh/components/edit_link.tsx";

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
  getItemBy;
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

    let item = (numid > 9999)
      ? await getItem(numid, type_of_media)
      : await getItemBySlug(slug, type_of_media);

    //FIXME getItemBySlug (news articles)=> redirect 301 to item with id
    if (!item) {
      const _news = await searchMynewsdesk({
        q: "",
        lang,
        limit: 32,
        type_of_media,
      });
      const found = _news?.items.find(({ url }) => url.includes(slug));
      if (found) {
        item = found;
      }
    }

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
    const _related = await fetchRelated(item);
    const projects = _related.filter(projectFilter).map((myn) =>
      projectFromMynewsdesk({ lang })(myn)
    );
    // const news = related.filter(newsFilter).map((myn) =>
    //   newsFromMynewsdesk({ lang })(myn)
    // );

    const images = _related.filter(imageFilter).map((myn) =>
      newsFromMynewsdesk({ lang })(myn)
    ).map(({ title, published, ...img }) => ({
      title: undefined,
      published: "",
      ...img,
    }));

    const documents = _related.filter(documentFilter);

    const videos = await Array.fromAsync(
      _related.filter(videoFilter).map(async ({ id }) => await getVideo(id)),
    );

    const related = { documents, videos, images };

    return ctx.render({
      item,
      lang,
      contacts,
      alternate,
      projects,
      related,
      origin: ctx.url,
    });
  },
};

//console.log("@todo News article needs bullet points for <li> elements");

export default function NewsArticle(
  { data: { item, lang, contacts, alternate, projects, related, origin } }:
    PageProps<
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
    id,
    ...mynewsdeskItem
  } = item;

  //https://cloudinary.com/documentation/transformation_reference#ar_aspect_ratio
  const img = image?.replace(",w_1782", ",w_1600,ar_18:9") ?? defaultImage;

  const __html = `<p style="font-size: 1rem">
  ${longDate(published_at.datetime, lang)} <a href="${
    intlRouteMap(lang).get("news")
  }">${t(`type.${type_of_media}`)}</a></p>${body ?? summary}`;

  const _caption = {
    fontSize: "0.75rem",
  };

  return (
    <Page title={header} collection="news">
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

        <p style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem;">
          {contacts && contacts.map(
            (contact) => (
              <section class="article-content">
                <PersonCard id={contact} icons={false} lang={lang} />
              </section>
            ),
          )}
        </p>

        {related.videos?.map((video) => (
          <div
            class="article-content"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              placeItems: "center",
            }}
          >
            <CollectionHeader
              text={video?.header ?? ""}
            />
            <VideoArticle item={video} embed={video?.embed} />
          </div>
        ))}

        {related.documents?.length > 0
          ? (
            <section class="article-content">
              {related.documents?.map((item) => (
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
            <CollectionHeader
              text={t("ui.Read_more")}
            />
            <HScroll maxVisibleChildren={5.5}>
              {projects.map(ArticleSquare)}
            </HScroll>
          </section>
        )}

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

        {related?.images?.length > 0 && (
          <section style={_section}>
            {
              /* <AlbumHeader
              text={t("nav.Images")}
            /> */
            }
            <HScroll>
              {related.images.map(ArticleSquare)}
            </HScroll>
          </section>
        )}
        <EditLinkIcon href={editHref(item)} />
      </Article>
      {
        /*

      FIXME Article: Edit icon when authorized
       */
      }
      {
        /* <GroupedSearch
        term={[header, body].join(
          " ",
        ).replace(
          /akvaplan-niva/i,
          " ",
        )}
        origin={origin}
        threshold={0.05}
        noInput
      /> */
      }
    </Page>
  );
}
