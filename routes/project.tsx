// FIXME (project.tsx) https://github.com/akvaplan-niva/akvaplan_fresh/issues/232
import _projects from "akvaplan_fresh/data/projects.json" with { type: "json" };
const cristinMap = new Map(_projects.map(({ id, cristin }) => [id, cristin]));

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
  Breadcrumbs,
  Card,
  CollectionHeader,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PersonCard as PersonCard } from "akvaplan_fresh/components/mod.ts";

import { Handlers, PageProps, RouteConfig } from "$fresh/server.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { projectsURL } from "akvaplan_fresh/services/nav.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  oramaSearchParamsForAuthoredPubs,
  oramaSortPublishedReverse,
  search,
} from "akvaplan_fresh/search/search.ts";
import akvaplanist from "akvaplan_fresh/routes/akvaplanist.tsx";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import { extractId } from "../services/extract_id.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt){/:date}?/:slug",
};

// export const oramaParamsForRelatedContent = ({ header }) => {
//   const term = name
//     ? name
//     : `${family} ${!/\s/.test(given) ? given : given.split(/\s/).at(0)}`.trim();

//   return {
//     term,
//     limit: 5,
//     sortBy: oramaSortPublishedReverse,
//     threshold: 0,
//     exact: true,
//     facets: { collection: {} },
//     groupBy: {
//       properties: ["collection"],
//       maxResult: 5,
//     },
//   };
// };

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
    const id = /-[0-9]+$/.test(slug)
      ? slug.split("-").slice(0, -1).join("-")
      : slug;

    const cristin = id && cristinMap.has(id) ? cristinMap.get(id) : undefined;

    const contacts = await fetchContacts(item);
    const [image] = await fetchImages(item);

    item.image_caption = item.image_caption ?? image.header;

    let { searchwords, logo, exclude } = projectMap.get(slug) ?? {};

    searchwords = [...new Set([...searchwords ?? [], slug].map(normalize))];
    const regex = searchwords.join("|");
    const needle = new RegExp(normalize(regex), "ui");

    const alternate = null;

    const term = cristin ? `cristin_${cristin}` : undefined;
    const orameQueryForNvaCristinProjectPubs = {
      term,
      properties: ["projects"],
      sortBy: oramaSortPublishedReverse,
      threshold: 0,
      exact: true,
      facets: { type: {} },
      groupBy: {
        properties: ["type"],
        maxResult: 5,
      },
    };
    const results = term
      ? await search(orameQueryForNvaCristinProjectPubs)
      : undefined;

    return ctx.render({
      item,
      cristin,
      results,
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
  {
    data: {
      item,
      lang,
      news,
      contacts,
      logo,
      alternate,
      origin,
      cristin,
      results,
    },
  }: PageProps<
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

  const breadcrumbs = [{
    href: projectsURL({ lang }),
    text: t("nav.Projects"),
  }];

  return (
    <Page title={header} collection="projects">
      <Breadcrumbs list={breadcrumbs} />
      <SearchHeader
        lang={lang}
        title={`${header} (${projectYears(start_at, end_at)})`}
        cloudinary={extractId(image)}
      />

      {
        /*<ArticleHeader
          header={`${header} (${projectYears(start_at, end_at)})`}
          image={img}
          imageCaption={image_caption}
        />*/
      }

      {cristin
        ? (
          <>
            {
              /*
              FIXME Use GroupedWorks to show project outcome
              <GroupedWorks grouped={grouped} groupedBy={"type"} lang={lang} /> */
            }

            <GroupedSearch
              results={results}
              collection={"type"}
              by={"type"}
              noInput
              display={"block"}
            />
          </>
        )
        : null}
      <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem;">
        {contacts && contacts.map(
          (contact) => (
            <section class="article-content">
              <PersonCard id={contact} icons={false} />
            </section>
          ),
        )}
      </li>

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

      <GroupedSearch
        term={`${header}`}
        exact={true}
        exclude={["project", "image", "pubs"]}
        origin={origin}
        noInput
        display="list"
        sort="-published"
      />

      {false && (
        <LinkIcon
          icon="edit"
          href={editHref(item)}
          children={t("ui.Edit")}
        />
      )}
      <Article
        language={language}
      >
        <AltLangInfo lang={lang} language={language} alternate={alternate} />
        <div
          class="article-content"
          dangerouslySetInnerHTML={{ __html }}
        />
      </Article>
    </Page>
  );
}
