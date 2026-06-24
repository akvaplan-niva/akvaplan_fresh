import { ID_PROJECTS } from "../kv/id.ts";
import { getSessionUser } from "../oauth/microsoft_helpers.ts";
import {
  getCachedPanelCard,
  getPanelInLang,
  mayEditKvPanel,
} from "@/kv/panel.ts";

import { extractId } from "@/services/extract_id.ts";

import { Panel } from "@/@interfaces/panel.ts";
import CollectionSearch from "@/islands/collection_search.tsx";

import { Handlers } from "$fresh/server.ts";
import { Forbidden } from "../components/forbidden.tsx";

import { projectHref } from "../services/mod.ts";
import { listProjects, saveProject } from "../kv/project.ts";
import { t } from "../text/mod.ts";
import { Project } from "@/@interfaces/project.ts";
import {
  buildResultFacet,
  getKvListAsOramaResult,
  publishedDesc,
} from "@/search/adapter/kv.ts";
import { atomizeProject } from "@/search/indexers/project_atomize.ts";

import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { Naked } from "@/components/naked.tsx";
import { ImgCard } from "@/components/cards.tsx";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { insertMultiple, type Result, type Results } from "@orama/orama";
import { OramaAtom } from "@/search/types.ts";
import { search } from "@/search/search.ts";
import { MajorSection } from "@/components/major_section.tsx";
import { SectionHeader } from "@/components/cards5.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { Intro } from "@/components/intro.tsx";
import { SearchHeader } from "@/components/search_header.tsx";
import { getOramaInstance } from "@/search/orama.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(projects|project|prosjekter|prosjekt)",
};

const facets = {
  lifecycle: {},
};

const limit = 100;

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
    limit,
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

  const { image, title } = (await getPanelInLang({
    id: ID_PROJECTS,
    lang,
  }) as Panel) ?? {
    image: { cloudinary: "9a35ivz6qc4sg8vkxx5scl" },
    title: t("our.projects"),
  };

  const hero = await getCachedPanelCard(ID_PROJECTS, lang);

  const { searchParams } = new URL(req.url);

  const collection = "project";
  const q = searchParams.get("q") ?? "";
  const mayCreateProject = await mayEditKvPanel(req);

  const oramaParams = buildOramaParams({ searchParams });
  const oramaResults = await search(oramaParams);

  const kvResults = await getKvListAsOramaResult<Project>(listProjects(), {
    mapper: async (p: Project) => await atomizeProject(p),
    limit,
    sorter: publishedDesc,
  });

  if (oramaResults.count < 1) {
    const projects = await Array.fromAsync(
      kvResults.hits.map(({ document }) => document),
    );
    console.warn(`Indexing ${projects.length} projects`);

    const orama = await getOramaInstance();
    await insertMultiple(
      orama,
      projects,
    );
  }

  const results = oramaResults && oramaResults?.count > 1
    ? oramaResults
    : kvResults;
  if (false === "facets" in results && results.hits.length > 0) {
    results.facets = {
      lifecycle: buildResultFacet("lifecycle", results.hits),
    };
  }
  const filters = Object.entries(oramaParams.where);

  return (
    <Naked title={title} _base={""} collection="home">
      <HeaderLogoStickyNav lang={lang} />

      <SearchHeader
        lang={lang}
        title={title}
        cloudinary={hero?.cloudinary}
      />
      {/* <Eyebrow text={hero.eyebrow} /> */}
      {mayCreateProject
        ? (
          <form method="POST">
            <a href={`/${lang}/${collection}/new`}>
              New project
            </a>
          </form>
        )
        : null}
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
        limit={limit}
        sortOptions={[
          "",
          "-published",
          "published",
        ]}
      />
    </Naked>
  );
});
