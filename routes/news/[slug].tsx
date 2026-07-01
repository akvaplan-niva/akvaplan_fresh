import { LegacyStyles, MorgenStudioStyles } from "@/components/styles.tsx";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageCard } from "@/components/hero/image_hero.tsx";
import { cardFromItem } from "@/services/news.ts";
import {
  documentFilter,
  eventFilter,
  fetchContacts,
  fetchRelated,
  getItem,
  getItemBySlug,
} from "@/services/mynewsdesk.ts";
import { Card } from "@/components/card.tsx";
import { ProjectsAsImageLinks } from "@/components/project_link.tsx";
import { projectsByMynewsdeskId } from "@/services/project.ts";
import { PersonCard } from "@/components/person_card.tsx";
import { Naked } from "@/components/naked.tsx";
import { t } from "@/text/mod.ts";
import { href } from "@/search/href.ts";

export const config: RouteConfig = {
  routeOverride:
    "/:lang(no|en){/akvaplan-niva}?/:type(news|nyhet|blog|pressreleases|pressrelease|pressemelding){/:isodate}?/:slug",
};

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

export const longDateIntl = (published: Date | string, lang: string) =>
  new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(
    new Date(published),
  );

export default defineRoute(async (_req, ctx) => {
  const { slug, lang, type } = ctx.params;

  const type_of_media = typeOfMedia(type);

  const id = Number(slug?.split("-").at(-1));

  const item = id > 9999
    ? await getItem(id, type_of_media)
    : await getItemBySlug(slug, type_of_media);

  const card = item ? cardFromItem(item) : null;
  if (!card) {
    return null;
  }
  item.links = item.links?.filter(({ text }) => "alternate" !== text);
  const _related = await fetchRelated(item);

  const projects = _related.filter(eventFilter).map((myn) =>
    projectsByMynewsdeskId.get(myn?.id)
  );

  const documents = _related.filter(documentFilter);

  const contacts = await fetchContacts(item);

  const { headline, caption, intro, body, cloudinary, updated, published } =
    card;

  //if ("no" === lang) {
  //const body2 = (await Array.fromAsync(translate(body))).join("");
  //}

  const __html = body; //.replaceAll(",t_limit_1000", ",w_1782");

  return (
    <Naked>
      <Head>
        <LegacyStyles />
        <MorgenStudioStyles />
      </Head>
      <HeaderLogoStickyNav lang={lang} class="dark" />
      <div color-scheme="dark" class="min-h-[66%]">
        <ImageCard
          eyebrow={t("nav.News1")}
          alt={caption}
          headline={headline}
          cloudinary={cloudinary}
          intro={intro}
        />
      </div>

      <div class="grid lg:grid-cols-[7fr_4fr] gap-0">
        <Card>
          <article
            style={{
              //fontSize: "calc(1.25rem + 0.1vw)",
              lineHeight: 1.5,
              width: "100%",
              //maxWidth: "600px",
              margin: "0 auto",
            }}
            class="article-content text-lg"
            dangerouslySetInnerHTML={{ __html }}
          />
        </Card>
        <div>
          <Card>
            <dl>
              <dt>
                {t("ui.Publisert")}
              </dt>
              <dd>
                <time>{longDateIntl(published, lang)}</time>
              </dd>
              <dt>
                {t("ui.Oppdatert")}
              </dt>
              <dd>
                <time>{longDateIntl(updated, lang)}</time>
              </dd>
            </dl>
          </Card>

          {contacts?.map((id: string) => <PersonCard id={id} icons={false} />)}

          {projects?.length > 0 && (
            <Card>
              <ProjectsAsImageLinks
                projects={projects}
                lang={lang}
              />
            </Card>
          )}

          <Card>
            {documents?.map((item) => (
              <a
                href={href({
                  ...item,
                  lang,
                  slug: item?.url?.split("/").at(-1),
                  collection: "document",
                })}
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
          </Card>
          <Card>
            {(item?.links && item.links?.length > 0) &&
              (
                <section class="article-content">
                  {item.links?.map(({ url, text }) => (
                    <Card>
                      <a href={url} class="ellipsis">{text ?? url}</a>
                    </Card>
                  ))}
                </section>
              )}
          </Card>

          <Card>
            <figure class="m-0 block overflow-hidden phablet:relative phablet:max-w-[24rem] phablet:w-1/2">
              <img
                class="w-full"
                src={`https://mnd-assets.mynewsdesk.com/image/upload/ar_16:9,c_fill,dpr_auto,f_auto,g_xy_center,q_auto:good,w_746,x_461,y_615/${cloudinary}`}
                alt={caption}
              />{" "}
              <figcaption class="text-md">{caption}</figcaption>
            </figure>
          </Card>
        </div>
      </div>

      <Head>
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
    </Naked>
  );
});
