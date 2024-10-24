import { longDate } from "akvaplan_fresh/time/mod.ts";
import {
  getNvaMetadata,
  nvaPublicationLanding,
} from "akvaplan_fresh/services/nva.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  buildCanonicalUri,
  getPubFromAkvaplanService,
} from "akvaplan_fresh/services/pub.ts";
import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";

import { PubArticle } from "akvaplan_fresh/components/pub_article.tsx";
import {
  hasPdf,
  PubNvaPdfAugment,
} from "akvaplan_fresh/islands/pub_nva_pdf_augment.tsx";
import { Card, Page } from "akvaplan_fresh/components/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  ProjectLink,
  ProjectsAsImageLinks,
} from "akvaplan_fresh/components/project_link.tsx";
import { mergeNvaAndCristinProjectsWithAkvaplanProjects } from "akvaplan_fresh/services/projects.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/:collection(publikasjon|publication|pub){/:kind(doi|hdl|nva|hdl\.handle\.net)}?/:idx*",
};

const NvaFunding = (funding) => (
  <p>
    {decodeURIComponent(funding.source?.split("/")?.at(-1))}
  </p>
);

const NvaFundings = ({ fundings }) => (
  <Card>
    <details open>
      <summary>
        {t(fundings.length === 1 ? "pubs.Funding" : "pubs.Funding")}
      </summary>

      {fundings?.map(NvaFunding)}
    </details>
  </Card>
);

export default defineRoute(async (_req, ctx) => {
  const { params } = ctx;
  const { collection, lang, kind, idx } = params;
  const scheme = idx?.startsWith("10.") ? "doi" : kind;

  const id = buildCanonicalUri(scheme, idx);
  let pub = await getOramaDocument(id);
  if (!pub) {
    // In case orama index is out-dated, or in rare cases where orama returns nothing,
    // like for 10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
    // FIXME _authors
    pub = await getPubFromAkvaplanService(id);
    if (pub) {
      pub._authors = pub.authors;
    }
  }
  if (!pub) {
    return ctx.renderNotFound();
  }

  const { nva, title, created, modified } = pub;
  const base = `/${lang}/${collection}/`;

  // Server-fetch NVA from Akvaplan-service
  // This delays rendering, but is needed since neither Akvaplan nor NVA service supports CORS.
  // FIXME? Move NVA fetch to browser island (requires adding CORS to Akvaplan pubs service, or using a CORS proxy)
  const nvaPublication = nva ? await getNvaMetadata(nva) : undefined;

  const projects = await mergeNvaAndCristinProjectsWithAkvaplanProjects(
    nvaPublication?.projects,
  );

  return (
    <Page
      title={title ?? ""}
      lang={lang}
      base={base}
      style={{
        fontSize: "1rem",
      }}
    >
      <PubArticle pub={pub} lang={lang} />

      {hasPdf(nvaPublication)
        ? <PubNvaPdfAugment publication={nvaPublication} lang={lang} />
        : null}

      {projects?.length > 0
        ? (
          <section
            style={{
              paddingBottom: ".5rem",
            }}
          >
            <ProjectsAsImageLinks
              projects={projects}
              lang={lang}
            />
          </section>
        )
        : null}

      {nvaPublication?.fundings?.length > 0
        ? (
          <section
            style={{
              paddingBottom: ".5rem",
            }}
          >
            <NvaFundings
              fundings={nvaPublication?.fundings}
            />
          </section>
        )
        : null}

      <p style={{ fontSize: ".75rem" }}>
        {t("time.Created")} <time>{longDate(created, lang)}</time>
        , {t("time.modified")} <time>{longDate(modified, lang)}</time>
      </p>
      {nva && (
        <p
          style={{
            backgroundColor: "transparent",
            fontSize: "0.75rem",
          }}
        >
          {t("pubs.Registered_in")}{" "}
          <a href={nvaPublicationLanding(nva)} target="_blank">
            {t("NVA")}
          </a>
        </p>
      )}
    </Page>
  );
});
