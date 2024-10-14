import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { longDate } from "akvaplan_fresh/time/mod.ts";

import { getNvaMetadata } from "akvaplan_fresh/services/nva.ts";

import { AkvaplanistCounts, Contributors } from "../components/contribs.tsx";
import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";
import { pubsURL } from "akvaplan_fresh/services/nav.ts";
import { PubNvaPdfAugment } from "../islands/pub_nva_pdf_augment.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { getUri, isDoiOrHandleUrl } from "akvaplan_fresh/services/pub.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/:collection(publikasjon|publication|pub){/:kind(doi|hdl|nva|hdl.handle.net)}?/:idx*",
};

export default defineRoute(async (_req, ctx) => {
  const { params } = ctx;
  const { collection, lang, kind, idx } = params;
  const scheme = idx?.startsWith("10.") ? "doi" : kind;

  const id = getUri(scheme, idx);
  const pub = await getOramaDocument(id).catch((res) => {
    console.warn("WARN getPubFromAkvaplanService", res);
  });

  if (!pub) {
    return ctx.renderNotFound();
  }

  const oa = false;

  const {
    container,
    type,
    nva,
    title,
    published,
    // FIXME _authors vs authors, switch: use _authors for string[] for orama indexing and authors for {family,given}[]
    //authors,
    _authors,
    contributors,
    license,
    akvaplanists,
    url,
    pdf,
    created,
    modified,
  } = pub;

  const typecode = nva ? `nva.${type}` : `type.${type}`;

  //const hreflang = pub?.lang ?? lang;
  const base = `/${lang}/${collection}/`;

  // Server-fetch NVA from Akvaplan-service
  //const t0 = performance.now();
  // This delays rendering, but is needed since neither Akvaplan nor NVA service supports CORS.
  // FIXME Move NVA fetch to browser island (requires adding CORS to Akvaplan pubs service, or using a CORS proxy)
  const nvaPublication = nva ? await getNvaMetadata(nva) : undefined;

  //const deltaT = performance.now() - t0;
  //console.warn(deltaT);

  return (
    <Page
      title={title ?? ""}
      lang={lang}
      base={base}
    >
      <article
        style={{
          fontSize: "1rem",
        }}
      >
        <p style={{ fontSize: ".75rem" }}>
          <a href={pubsURL({ lang }) + `?type=${type}`}>{t(typecode)}</a>
        </p>
        <Card>
          <h1
            style={{ fontSize: "1.75rem" }}
            dangerouslySetInnerHTML={{ __html: title }}
          />

          <p>
            <em dangerouslySetInnerHTML={{ __html: container ?? "" }} />{" "}
            (<time>{published}</time>)
          </p>

          <p>
            {isDoiOrHandleUrl(id)
              ? (
                <a target="_blank" href={id}>
                  {id}
                </a>
              )
              : (
                <a target="_blank" href={url}>
                  {url}
                </a>
              )}
          </p>
        </Card>

        <p style={{ fontSize: ".75rem" }}>
          <a href={`?type=${type}`}>{license}</a>
        </p>

        <div
          style={{
            display: "grid",
            placeItems: "center",
            fontSize: "1rem",
          }}
        >
          <div style={{ width: "100%" }}>
            <div style={{ background: "var(--surface1)", paddingTop: "1rem" }}>
              <AkvaplanistCounts akvaplanists={akvaplanists} />
            </div>

            <Section
              style={{
                paddingTop: ".25rem",
                paddingBottom: ".25rem",
              }}
            >
              {_authors?.length > 0 && (
                <Card>
                  <details open>
                    <summary style={{ paddingBottom: "1rem" }}>
                      {_authors?.length > 1
                        ? t("pubs.Authors")
                        : t("pubs.Author")} ({_authors.length})
                    </summary>
                    <Contributors
                      contributors={_authors}
                      akvaplanists={akvaplanists}
                      lang={lang}
                    />
                  </details>
                </Card>
              )}

              {contributors?.length > 0 && (
                <Card>
                  <details open>
                    <summary style={{ paddingBottom: "1rem" }}>
                      {contributors?.length > 1
                        ? t("pubs.Contributors")
                        : t("pubs.Contributor")} ({contributors.length})
                    </summary>

                    <Contributors
                      contributors={contributors}
                      akvaplanists={akvaplanists}
                      lang={lang}
                    />
                  </details>
                </Card>
              )}
            </Section>

            {pdf ||
                url?.endsWith(".pdf")
              ? (
                <a download href={pdf ?? url} target="_blank">
                  <Button
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "0.75rem",
                    }}
                  >
                    {t("pubs.Download_pdf")}
                  </Button>
                </a>
              )
              : null}
            {nva && (
              <PubNvaPdfAugment publication={nvaPublication} lang={lang} />
            )}
          </div>
        </div>
        <p style={{ fontSize: ".75rem" }}>
          {t("time.Created")} <time>{longDate(created, lang)}</time>
          , {t("time.modified")} <time>{longDate(modified, lang)}</time>
        </p>
      </article>
    </Page>
  );
});

/**
Year: 2014
Type: article
Source: Environmental Research Letters
Authors Brage Bremset Hansen, Ketil Isaksen, Rasmus Benestad, Jack Kohler, Åshild Ønvik Pedersen +4 more
Institutions Norwegian University of Science and Technology, Norwegian Meteorological Institute, Norwegian Polar Institute, Norwegian University of Life Sciences, Akvaplan-niva
Cites: 47
Cited by: 216
Related to: 10
Topic: Arctic Permafrost Dynamics and Climate Change
Subfield: Atmospheric Science
Field: Earth and Planetary Sciences
Domain: Physical Sciences
Sustainable Development Goal No poverty
Open Access status: gold
APC paid (est): $1 901
Funder Norges Forskningsråd
Grant ID POLARPROG Grant Number 216051
 */
