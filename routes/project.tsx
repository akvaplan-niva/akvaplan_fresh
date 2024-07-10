// FIXME (project.tsx) https://github.com/akvaplan-niva/akvaplan_fresh/issues/232
import {
  editHref,
  fetchContacts,
  fetchImages,
  getItem,
  getItemBySlug,
  projectMap,
  projectYears,
} from "akvaplan_fresh/services/mod.ts";

import { isodate, normalize } from "akvaplan_fresh/utils/mod.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import {
  AltLangInfo,
  Article,
  ArticleHeader,
  Card,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PeopleCard as PersonCard } from "akvaplan_fresh/components/mod.ts";

import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { TypeArgumentedNode } from "https://deno.land/x/ts_morph@21.0.1/ts_morph.js";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt){/:date}?/:slug",
};

export const handler: Handlers = {
  async GET(req, ctx) {
    const { url, params } = ctx;
    const { slug, lang, type } = params;
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

    return ctx.render({
      item,
      lang,
      logo,
      contacts,
      alternate,
      origin: url,
    });
  },
};

interface ArticleProps {
  item: MynewsdeskItem;
  lang: string;
}

export default function ProjectHome(
  { data: { item, lang, news, contacts, logo, alternate, origin } }: PageProps<
    ArticleProps
  >,
) {
  const {
    id,
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

  return (
    <Page title={header} collection="projects">
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

        <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem;">
          {contacts && contacts.map(
            (contact) => (
              <section class="article-content">
                <PersonCard id={contact} icons={false} />
              </section>
            ),
          )}
        </li>
      </Article>

      <h2>{t("project.Outreach")}</h2>

      <GroupedSearch
        term={`${header}`}
        exact={true}
        exclude={["project", "image"]}
        origin={origin}
        noInput
        sort="-published"
      />

      {TypeArgumentedNode && (
        <LinkIcon
          icon="edit"
          href={editHref(item)}
          target="_blank"
          children={t("ui.Edit")}
        />
      )}
    </Page>
  );
}
