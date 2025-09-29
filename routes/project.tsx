import {
  editHref,
  fetchContacts,
  getItem,
  projectYears,
} from "akvaplan_fresh/services/mod.ts";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import {
  AltLangInfo,
  Article,
  Breadcrumbs,
  Card,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PersonCard as PersonCard } from "akvaplan_fresh/components/mod.ts";

import { defineRoute, RouteConfig } from "$fresh/server.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { projectsURL } from "akvaplan_fresh/services/nav.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import {
  projectsIdMap,
  searchOramaForProjectPublicationsInNva,
} from "akvaplan_fresh/services/project.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt){/:date}?/:slug",
};

export default defineRoute(async (req, ctx) => {
  const { url, params } = ctx;
  const { lang, slug } = params;
  langSignal.value = lang;

  if (!projectsIdMap.has(slug)) {
    return ctx.renderNotFound();
  }
  const project = projectsIdMap.get(slug)!;
  const pubs = project.cristin > 0
    ? await searchOramaForProjectPublicationsInNva(project.cristin)
    : undefined;

  // @todo FIXME, remove mynewsdesk dependency
  const mynewsdesk = project.mynewsdesk
    ? await getItem(project.mynewsdesk, "event")
    : undefined;

  const contacts = mynewsdesk ? await fetchContacts(mynewsdesk) : undefined;

  const { cloudinary, cristin, start, end, published } = project; // id && cristinMap.has(id) ? cristinMap.get(id) : undefined;

  // const contacts = await fetchContacts(item);
  // const [image] = await fetchImages(item);

  // item.image_caption = item.image_caption ?? image.header;

  // let { searchwords, logo, exclude } = projectMap.get(slug) ?? {};

  // searchwords = [...new Set([...searchwords ?? [], slug].map(normalize))];
  // const regex = searchwords.join("|");
  // const needle = new RegExp(normalize(regex), "ui");
  const { body, summary } = mynewsdesk;
  const __html = body ?? summary;
  const title = project.title[lang];
  const _caption = {
    fontSize: "0.75rem",
  };

  const breadcrumbs = [{
    href: projectsURL({ lang }),
    text: t("nav.Projects"),
  }];

  const links = [];
  const alternate = lang === "en" ? "no" : "en";

  const term = mynewsdesk ? `${mynewsdesk.id}` : `${title}`.toLowerCase();

  return (
    <Page title={title} collection="projects">
      <Breadcrumbs list={breadcrumbs} />
      <SearchHeader
        lang={lang}
        title={title}
        subtitle={projectYears(start, end)}
        cloudinary={cloudinary}
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
              results={pubs}
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
        term={term}
        exact={true}
        exclude={["project", "image", "pubs"]}
        origin={url}
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
        language={String(lang)}
      >
        <AltLangInfo lang={lang} language={lang} alternate={alternate} />
        <div
          class="article-content"
          dangerouslySetInnerHTML={{ __html }}
        />

        {"cristin" in project && project.cristin > 0
          ? (
            <p style={{ fontSize: ".75rem" }}>
              {t("pubs.Registered_in")}{" "}
              <a href={`https://nva.sikt.no/projects/${project.cristin}`}>
                {t("NVA")}
              </a>
            </p>
          )
          : null}
      </Article>
    </Page>
  );
});
