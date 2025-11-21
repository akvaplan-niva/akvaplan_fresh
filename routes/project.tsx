// Data
import { getProject, saveProject } from "akvaplan_fresh/kv/project.ts";
import {
  projectFromMynewsdeskId,
  searchOramaForProjectPublicationsInNva,
} from "akvaplan_fresh/services/project.ts";

// Helpers
import { projectHref, projectPeriod } from "akvaplan_fresh/services/mod.ts";
import { isodate } from "../time/intl.ts";
import { projectsURL } from "akvaplan_fresh/services/nav.ts";

// Internals
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { getSessionUser } from "../oauth/microsoft_helpers.ts";
import type { MicrosoftUserinfo } from "../oauth/microsoft_userinfo.ts";
import { defineRoute, Handlers, RouteConfig } from "$fresh/server.ts";

// Islands
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { ProjectNew } from "../islands/project/project_new.tsx";

// Components
import {
  AltLangInfo,
  Article,
  Breadcrumbs,
  Card,
  Icon,
  Page,
} from "akvaplan_fresh/components/mod.ts";

import { PersonCard } from "akvaplan_fresh/components/mod.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import { Markdown } from "akvaplan_fresh/components/markdown.tsx";
import { Forbidden } from "../components/forbidden.tsx";
import { mayEditKvPanel } from "../kv/panel.ts";
import { newProjectFromNvaId } from "../services/nva_project.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(project|prosjekt)/:id{/:slug}?",
};

const newMynewsdeskProjectResponse = async (mynewsdesk: number, user) => {
  if (mynewsdesk > 0) {
    const project = await projectFromMynewsdeskId(mynewsdesk);
    const result = await saveProject(project, user);
    return result && result.ok
      ? Response.json({ project, result })
      : new Response("Invalid project", { status: 400 });
    // ? new Response(null, {
    //   status: 303,
    //   headers: { location: `/${id}` },
    // })
  }
};

const newNvaProjectResponse = async (nva_project_id: number) => {
  if (nva_project_id > 0) {
    const project = await newProjectFromNvaId(nva_project_id);
    return project
      ? Response.json(project)
      // ? new Response(null, {
      //   status: 303,
      //   headers: { location: `/${id}` },
      // })
      : new Response("Invalid project", { status: 400 });
  }
};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const editor = await mayEditKvPanel(req);
    if (!editor) {
      return Forbidden();
    } else {
      const form = await req.formData();
      const user = await getSessionUser(req) as MicrosoftUserinfo;

      if (form.has("mynewsdesk_id")) {
        const mynewsdesk = Number(form.get("mynewsdesk_id"));
        return newMynewsdeskProjectResponse(mynewsdesk, user);
      } else if (form.has("nva_project_id")) {
        const nva_project_id = Number(form.get("nva_project_id"));
        return newNvaProjectResponse(nva_project_id, user);
      }
      return new Response("Invalid project", { status: 400 });
    }
  },
};

export default defineRoute(async (req, ctx) => {
  const { url, params } = ctx;
  const { lang, type, id, slug } = params;
  langSignal.value = lang;

  if ("new" === id) {
    return (
      <Page>
        <ProjectNew />
      </Page>
    );
  }

  const project = await getProject(id);
  if (!project) {
    return ctx.renderNotFound();
  }

  const pubs = project?.cristin > 0
    ? await searchOramaForProjectPublicationsInNva(project.cristin)
    : undefined;

  const {
    abbr,
    cloudinary,
    cristin,
    start,
    end,
    links,
    akvaplanists,
    published,
    updated,
  } = project;

  const summary = project.summary?.[lang]?.length > 0
    ? project.summary?.[lang] ??
      Object.values(project?.summary).at(0)
    : "";

  const title = project?.title?.[lang]?.length > 0
    ? project.title[lang] ?? Object.values(project.title)[0]
    : abbr;

  const text = summary?.replaceAll(
    /\<a href=\"\/(no|en)\//g,
    `<a href="/${lang}/`,
  );

  const breadcrumbs = [{
    href: projectsURL({ lang }),
    text: t("nav.Projects"),
  }];

  const alternate = lang === "en" ? "no" : "en";

  const term = project.mynewsdesk
    ? `${project.mynewsdesk}`
    : abbr
    ? abbr
    : `${title}`.toLowerCase();

  const user = await getSessionUser(req) as MicrosoftUserinfo;
  const rcnLink = project?.rcn > 0
    ? (
      <ol
        style="grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));"
        color-scheme="dark"
      >
        <li style="font-size: 0.75rem; margin: 1px; background: var(--surface4);">
          <div style="display: grid; gap: 0.5rem; padding: 0.5rem; grid-template-columns: 2fr 4fr;">
            <a
              href={`https://prosjektbanken.forskningsradet.no/project/FORISS/${project.rcn}`}
              style="place-content: center;"
            >
              <img
                width="143"
                height="26"
                alt="Forskningsrådet logo"
                src="/icon/logo/forskningsradet.svg"
                style="border-radius: 0.125rem;"
              />
            </a>
          </div>
        </li>
      </ol>
    )
    : null;

  return (
    <Page title={title} collection="projects">
      <SearchHeader
        lang={lang}
        title={
          <>
            <Breadcrumbs list={breadcrumbs} />
            {abbr}
            {user
              ? (
                <LinkIcon
                  icon="edit"
                  href={projectHref(project) + "/w"}
                  children={""}
                />
              )
              : null}
          </>
        }
        subtitle={
          <p style="font-size: 0.9rem">{projectPeriod(start, end, lang)}</p>
        }
        cloudinary={cloudinary}
      />

      <Article
        language={String(lang)}
      >
        <AltLangInfo lang={lang} language={lang} alternate={alternate} />

        <Markdown
          text={title !== abbr ? `#${title}\n\n` : ""}
        />
        {rcnLink}
        <Markdown
          text={text}
        />
        <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:1rem;">
          {akvaplanists && akvaplanists.map && akvaplanists?.map(
            (id) => (
              <section class="article-content">
                <PersonCard id={id} icons={false} />
              </section>
            ),
          )}
        </li>
      </Article>

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

      <p style={{ fontSize: ".75rem" }}>
        Publisert {isodate(published)}, oppdatert {isodate(updated)}.
        {"cristin" in project && project.cristin > 0
          ? (
            <>
              {" "}
              {t("pubs.Registered_in")}{" "}
              <a href={`https://nva.sikt.no/projects/${project.cristin}`}>
                {t("NVA")}
              </a>.
            </>
          )
          : null}
      </p>
    </Page>
  );
});
