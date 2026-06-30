// Data
import { getProject, saveProject } from "@/kv/project.ts";
import { projectFromMynewsdeskId } from "@/services/project.ts";

// Helpers
import { isodate } from "../time/intl.ts";
import { projectHref, projectsURL } from "@/services/nav.ts";

// Internals
import { lang as langSignal, t } from "@/text/mod.ts";
import { getSessionUser } from "../oauth/microsoft_helpers.ts";
import type { MicrosoftUserinfo } from "../oauth/microsoft_userinfo.ts";
import { defineRoute, Handlers, RouteConfig } from "$fresh/server.ts";

// Islands
import GroupedSearch from "@/islands/grouped_search.tsx";
import { ProjectNew } from "../islands/project/project_new.tsx";

// Components
import { AltLangInfo, Breadcrumbs, Card, Page } from "@/components/mod.ts";

import { PersonCard } from "@/components/mod.ts";
import { Markdown } from "@/components/markdown.tsx";
import { Forbidden } from "../components/forbidden.tsx";
import { mayEditKvPanel } from "../kv/panel.ts";
import { newProjectFromNvaId } from "../services/nva_project.ts";
import { Naked } from "@/components/naked.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";
import { ImageCard } from "@/components/hero/image_hero.tsx";
import { LinkIcon } from "@/components/icon_link.tsx";
import { projectPeriod } from "@/services/projects.ts";
import { longDateIntl } from "@/routes/news/[slug].tsx";

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

export const handler: Handlers = {
  async POST(req, ctx) {
    const editor = await mayEditKvPanel(req);
    if (!editor) {
      return Forbidden();
    } else {
      const { url, params } = ctx;
      const { lang, type, id, slug } = params;
      langSignal.value = lang;

      const form = await req.formData();
      const user = await getSessionUser(req) as MicrosoftUserinfo;

      if (form.has("mynewsdesk_id")) {
        const mynewsdesk = Number(form.get("mynewsdesk_id"));
        return newMynewsdeskProjectResponse(mynewsdesk, user);
      } else if (form.has("nva_project_id")) {
        const nva_project_id = Number(form.get("nva_project_id"));
        const project = await newProjectFromNvaId(nva_project_id);
        //return <ProjectNew project={project} />;
        return ctx.render({ project });
      }
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
    pubs,
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
  }, { text: "nav.Project" }];

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
        style="padding: 1rem; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));"
        color-scheme="dark"
      >
        <li style="font-size: 1rem; margin: 1px; background: var(--surface4);">
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

  const pubsAsSearchHits = pubs && pubs?.length > 0
    ? pubs?.sort((a, b) => a.id?.localeCompare(b.id))?.map((
      document,
    ) => ({ document, score: 1, lang }))
    : null;

  const groupedPubs = pubsAsSearchHits
    ? Map.groupBy(pubsAsSearchHits, ({ document }) => document.type)
    : null;

  const header = (
    <span style={{ fontFamily: "var(--mono" }}>
      <Breadcrumbs list={breadcrumbs} icon={"arrow_forward_ios"} />
    </span>
  );

  return (
    <Naked title={title} collection="projects">
      <HeaderLogoStickyNav lang={lang} />

      {
        /* <SearchHeader
        lang={lang}
        title={
          <>
            <Breadcrumbs list={breadcrumbs} />
            {abbr}

          </>
        }
        subtitle={

        }
        cloudinary={cloudinary}
      /> */
      }

      <article lang={String(lang)} style="--surface0: transparent">
        <ImageCard
          eyebrow={t("nav.Project")}
          cloudinary={cloudinary}
          headline={title}
          href={projectsURL({ lang })}
        />

        {user
          ? (
            <p>
              <LinkIcon
                icon="edit"
                href={projectHref({ id, title: "_", lang }) + "/w"}
              />
            </p>
          )
          : null}

        <AltLangInfo lang={lang} language={lang} alternate={alternate} />

        <div class="grid lg:grid-cols-[7fr_4fr] gap-12 -scroll-mt-12">
          <article class="article-content text-lg p-3 lg:px-24">
            {abbr ? <h2 class="h4 pb-6">{abbr}</h2> : null}
            <dl class="pb-6">
              <dt>Prosjektperiode</dt>
              <dd>{projectPeriod(start, end, lang)}</dd>
            </dl>
            <Markdown
              text={text}
              style={{
                fontSize: "calc(1.25rem + 0.1vw)",
              }}
            />
          </article>
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
            <li style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));grid-gap:0rem;">
              {akvaplanists && akvaplanists.map && akvaplanists?.map(
                (id) => (
                  <section class="article-content">
                    <PersonCard id={id} icons={false} />
                  </section>
                ),
              )}
            </li>

            {rcnLink}

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
              {"cristin" in project && project.cristin > 0
                ? (
                  <>
                    {" "}
                    {t("pubs.Publications_from")}{" "}
                    <a
                      href={`https://nva.sikt.no/projects/${project.cristin}`}
                    >
                      {t("NVA")}
                    </a>.
                  </>
                )
                : null}
            </p>

            {cristin && cristin > 0
              ? (
                <GroupedSearch
                  term={`cristin_${cristin}`}
                  collection={"pubs"}
                  sort={"-published"}
                  origin={url}
                  noInput
                />
              )
              : null}

            {
              /* {groupedPubs && groupedPubs.size > 0
              ? [...groupedPubs].map(([type, pubsOfType], i) => (
                <GroupedSearchCollectionResults
                  query={""}
                  hits={pubsOfType.sort(publishedDesc)}
                  group={t(`type.${type}`)}
                  collection="oubs"
                  count={pubsOfType.length}
                  display={{ value: "block" }}
                  open={i < 1}
                />
              ))
              : null} */
            }
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
          </div>
        </div>
      </article>
    </Naked>
  );
});
