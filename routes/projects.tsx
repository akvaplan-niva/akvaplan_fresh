import { genid, ID_PROJECTS } from "../kv/id.ts";
import { getSessionUser } from "../oauth/microsoft_helpers.ts";
import { getPanelInLang, mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";

import { search } from "akvaplan_fresh/search/search.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";

import { extractId } from "akvaplan_fresh/services/extract_id.ts";

import { Panel } from "akvaplan_fresh/@interfaces/panel.ts";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";

import { Button } from "../components/button/button.tsx";
import { Handlers } from "$fresh/server.ts";
import { Forbidden } from "../components/forbidden.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { projectHref } from "../services/mod.ts";
import { saveProject } from "../kv/project.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const facets = {
  lifecycle: {},
};

const buildOramaParams = (
  { searchParams }: { searchParams: URLSearchParams },
) => {
  const where: { collection: string[]; lifecycle?: string } = {
    collection: ["project"],
  };
  if (searchParams.has("filter-lifecycle")) {
    where.lifecycle = searchParams.get("filter-lifecycle") ?? undefined;
  }
  const term = searchParams.get("q") ?? "";
  return {
    term,
    limit: 100,
    where,
    facets,
    sortBy: { order: "DESC", property: "published" },
    threshold: 0.5,
  };
};

export const handler: Handlers = {
  async POST(req, ctx) {
    if (await mayEditKvPanel(req) === true) {
      const { lang } = ctx.params;
      const user = await getSessionUser(req);

      const formData = await req.formData();
      const id = formData.get("id") as string;
      const emptyIntl = { en: "", no: "" };
      const project = {
        id,
        abbr: id,
        created: new Date(),
        created_by: user.email,
        title: emptyIntl,
        summary: emptyIntl,
      };
      const res = await saveProject(project, user);
      if (res && res.ok) {
        return new Response("", {
          status: 303,
          headers: { Location: projectHref({ id, lang }) + "/w" },
        });
      }
      return new Response("Failed creating project", { status: 500 });
    }
    return Forbidden();
  },
};

export default defineRoute(async (req, ctx) => {
  const { lang } = ctx.params;

  const { image, title } = await getPanelInLang({
    id: ID_PROJECTS,
    lang,
  }) as Panel;

  const { searchParams } = new URL(req.url);

  const oramaParams = buildOramaParams({ searchParams });
  const results = await search(oramaParams);
  const collection = "project";
  const filters = Object.entries(oramaParams.where);
  const q = searchParams.get("q") ?? "";
  const mayCreateProject = await mayEditKvPanel(req);

  return (
    <Page title={title} _base={""} collection="home">
      <SearchHeader
        lang={lang}
        title={title}
        subtitle={mayCreateProject
          ? (
            <form method="POST">
              <a href={`/${lang}/${collection}/new`}>
                New project
              </a>
            </form>
          )
          : null}
        cloudinary={image?.cloudinary ?? extractId(image.url)}
      />

      <CollectionSearch
        placeholder={title}
        collection={collection}
        q={q}
        lang={lang}
        results={results}
        filters={[...filters]}
        facets={facets}
        //total={count}
        //list="list"
        url={req.url}
        limit={100}
        sortOptions={[
          "",
          "-published",
          "published",
        ]}
      />

      {
        /* {["ongoing", "past"].map((key) => (
        <Section>
          <CollectionHeader text={t(`project.Lifecycle.${key}`)} />
          <HScroll>
            {grouped.get(key)?.map(ArticleSquare)}
          </HScroll>
        </Section>
      ))} */
      }
    </Page>
  );
});
