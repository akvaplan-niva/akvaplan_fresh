import { longDate } from "../time/intl.ts";
import {
  getNvaMetadata,
  getPresignedFileUrl,
  isNvaUrl,
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
import { Breadcrumbs, Page } from "akvaplan_fresh/components/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import {
  ProjectsAsImageLinks,
} from "akvaplan_fresh/components/project_link.tsx";

// import {
//   getAkvaplanProjectsFromNvaCristinIds,
//   mergeNvaAndCristinProjectsWithAkvaplanProjects,
// } from "akvaplan_fresh/services/projects.ts";

import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { pubsURL } from "akvaplan_fresh/services/nav.ts";
import { akvaplanProjectsFromNvaProjects } from "akvaplan_fresh/services/projects.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/:collection(publikasjon|publication|pub){/:kind(doi|hdl|nva|hdl\.handle\.net)}?/:idx*",
};

// const NvaFunding = (funding) => (
//   <p>
//     {decodeURIComponent(funding.source?.split("/")?.at(-1))}
//   </p>
// );

// const NvaFundings = ({ fundings }) => (
//   <Card>
//     <details open>
//       <summary>
//         {t(fundings.length === 1 ? "pubs.Funding" : "pubs.Funding")}
//       </summary>

//       {fundings?.map(NvaFunding)}
//     </details>
//   </Card>
// );

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { collection, lang, kind, idx } = params;
  const scheme = idx?.startsWith("10.") ? "doi" : kind;

  const id = buildCanonicalUri(scheme, idx);

  let pub = await getOramaDocument(id);

  if (!pub) {
    // In case orama index is out-dated, or in rare cases where orama returns nothing,
    // like for 10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
    pub = await getPubFromAkvaplanService(id);
  }

  if (!pub) {
    return ctx.renderNotFound();
  }

  const { nva, title, created, modified, type } = pub;
  const base = `/${lang}/${collection}/`;
  // Server-fetch NVA from Akvaplan-service
  // This delays rendering, but is needed since neither Akvaplan nor NVA service supports CORS.
  // FIXME? Move NVA fetch to browser island (requires adding CORS to Akvaplan pubs service, or using a CORS proxy)
  const nvaPublication = nva ? await getNvaMetadata(nva) : undefined;

  const associatedArtifactsWithPresignedFileUrls =
    nvaPublication && nvaPublication.associatedArtifacts?.length > 0
      ? await Array.fromAsync(
        nvaPublication.associatedArtifacts?.map(async (file) => {
          if (file) {
            file.presigned = await getPresignedFileUrl(
              nvaPublication.identifier,
              file.identifier,
              req.url,
            );
          }
          return file;
        }),
      )
      : undefined;

  if (associatedArtifactsWithPresignedFileUrls) {
    nvaPublication.associatedArtifacts =
      associatedArtifactsWithPresignedFileUrls;
  }

  const nvaProjects = nvaPublication ? nvaPublication?.projects : undefined;

  const nvaProjectsWithAkvaplanIds = nvaProjects
    ? await akvaplanProjectsFromNvaProjects(nvaProjects)
    : undefined;

  const typeText = t(
    isHandleUrl(id) || isNvaUrl(id) ? `nva.${type}` : `type.${type}`,
  );
  const typeHref = pubsURL({ lang }) + `?filter-type=${type}`;

  const breadcrumbs = [{
    href: pubsURL({ lang }),
    text: t("nav.Pubs"),
    img: {
      src:
        "https://mnd-assets.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_16,h_16,q_auto:good/kwy8kuceecjpjoh3yyy5",
    },
  }, {
    href: typeHref,
    text: typeText,
  }];

  return (
    <Page
      title={title ?? ""}
      lang={lang}
      base={base}
      style={{
        fontSize: "1rem",
      }}
    >
      <p>
        {
          /* <a href={pubsURL({ lang }) + `?q=${type}&filter-type=${type}`}>
          {typeText}
        </a> */
        }
        <span
          style={{
            fontSize: "var(--font-size-1)",
            display: "grid",
            gap: "1rem",
            placeItems: "center",
            gridTemplateColumns: "1fr",
            color: "var(--text1)",
          }}
        >
          <Breadcrumbs list={breadcrumbs} />
        </span>
      </p>

      <div
        style={{ containerType: hasPdf(nvaPublication) ? "inline-size" : null }}
      >
        <div class="two-columns">
          <div class="one">
            <PubArticle pub={pub} lang={lang} />

            {nvaProjectsWithAkvaplanIds?.length > 0
              ? (
                <section
                  style={{
                    paddingBottom: ".5rem",
                  }}
                >
                  <ProjectsAsImageLinks
                    projects={nvaProjectsWithAkvaplanIds}
                    lang={lang}
                  />
                </section>
              )
              : null}
          </div>

          {hasPdf(nvaPublication)
            ? (
              <div class="two">
                <PubNvaPdfAugment
                  publication={nvaPublication}
                  url={req.url}
                  lang={lang}
                />
              </div>
            )
            : null}
        </div>
      </div>

      {
        /* {nvaPublication?.fundings?.length > 0
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
        : null} */
      }

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
