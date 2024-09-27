import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  fetchNvaMetadataFromAkvaplanService,
  getPubFromAkvaplanService,
} from "akvaplan_fresh/services/pub.ts";

const NVA_API_PROD = "https://api.nva.unit.no";

const NVA_API = globalThis?.Deno && Deno.env.has("NVA_API")
  ? Deno.env.get("NVA_API")
  : NVA_API_PROD;

const searchNvaForId = async (id: string) => {
  const url = new URL(`/search/resources`, NVA_API);
  if (isHandleUrl(id)) {
    url.searchParams.set("handle", id);
  } else if (isDoiUrl(id)) {
    url.searchParams.set("doi", id);
  } else {
    throw new RangeError();
  }

  const r = await fetch(url);
  if (r?.ok) {
    return r.json();
  }
};

const nvaLanding = (id: string, lang?: string) =>
  `https://test.nva.sikt.no/registration/${id}`;

import { AkvaplanistCounts, Contributors } from "../components/contribs.tsx";
import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";
import { SlimPublication } from "akvaplan_fresh/@interfaces/mod.ts";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { pubsURL } from "akvaplan_fresh/services/nav.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/:collection(publikasjon|publication|pub){/:kind(doi|hdl|nva|hdl.handle.net)}?/:idx*",
};

const getUri = (kind: string, id: string) => {
  switch (kind) {
    case "doi":
      return new URL(id, "https://doi.org").href;
    case "hdl":
      return new URL(id, "https://hdl.handle.net").href;
    case "nva":
      return new URL(
        `/publication/${id}`,
        NVA_API,
      ).href;
    default:
      throw "Unsupported id scheme";
  }
};

const isDoiUrl = (id: string) => "doi.org" === new URL(id).hostname;
const isHandleUrl = (id: string) => "hdl.handle.net" === new URL(id).hostname;
///^[0-9]+\/[0-9]+$/.test(id);

const isDoiOrHandleUrl = (id: string) => isDoiUrl(id) || isHandleUrl(id);

const searchNva = async ({ id }: Pub) => {
  if (isDoiOrHandleUrl(id)) {
    return await searchNvaForId(id);
  }
};

if both fullfils, we should choose the data from service…
const preferService = <T,>(
  arr: PromiseSettledResult<T>[],
) => {
  const fulf = arr?.filter((r) => "fulfilled" === r.status);
  const svc = fulf?.find((p) =>
    p && p?.value && !Object.hasOwn(p.value, "year")
  );
  if (svc) {
    return svc.value;
  }
  return fulf ? fulf.at(0)?.value : undefined;
};

const getPubFromServiceOrOrama = async (id: string) =>
  preferService(
    await Promise.allSettled([
      getPubFromAkvaplanService(id),
      getOramaDocument(id),
    ]),
  );

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { collection, lang, kind, idx } = params;
  const scheme = idx?.startsWith("10.") ? "doi" : kind;

  const id = getUri(scheme, idx);

  const perfkey = "getPubFromAkvaplanService";
  const t0 = performance.now(); //performance.timeOrigin

  performance.mark(perfkey);
  const pub = await getPubFromServiceOrOrama(id);
  const measure = performance.measure(perfkey);
  console.warn(perfkey, measure.duration, "duration");
  console.warn("ðT", performance.now() - t0);
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
    authors,
    contributors,
    license,
    akvaplanists,
    url,
  } = pub;
  const typecode = nva ? `nva.${type}` : `type.${type}`;

  const resNva = nva
    ? await fetchNvaMetadataFromAkvaplanService(nva)
    : undefined;
  const nvaMetadata = resNva?.ok ? await resNva.json() : undefined;

  const abstract = nvaMetadata && nvaMetadata.entityDescription.abstract;
  const description = nvaMetadata && nvaMetadata.entityDescription.description;

  //const hreflang = pub?.lang ?? lang;
  const base = `/${lang}/${collection}/`;
  return (
    <Page
      title=""
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
              {authors?.length > 0 && (
                <Card>
                  <h2 style={{ fontSize: "1rem" }}>
                    {authors?.length > 1 ? t("pubs.Authors") : t("pubs.Author")}
                    {" "}
                    ({authors.length})
                  </h2>
                  <Contributors
                    contributors={authors}
                    akvaplanists={akvaplanists}
                    lang={lang}
                  />
                </Card>
              )}

              {contributors?.length > 0 && (
                <Card>
                  <h2 style={{ fontSize: "1rem" }}>
                    {contributors?.length > 1
                      ? t("pubs.Contributors")
                      : t("pubs.Contributor")} ({contributors.length})
                  </h2>

                  <Contributors
                    contributors={contributors}
                    akvaplanists={akvaplanists}
                    lang={lang}
                  />
                </Card>
              )}
            </Section>

            {description && (
              <Section>
                <h2>{t("Description")}</h2>
                <p
                  dangerouslySetInnerHTML={{ __html: description }}
                  style={{ maxWidth: "120ch", fontSize: "1rem" }}
                />
              </Section>
            )}

            {abstract && (
              <Section>
                <h2>{t("Abstract")}</h2>
                <p
                  dangerouslySetInnerHTML={{ __html: abstract }}
                  style={{ maxWidth: "120ch", fontSize: "1rem" }}
                />
              </Section>
            )}
          </div>
        </div>
        {nva && <a href={nvaLanding(nva, lang)}>View in NVA</a>}
        {
          /* <pre>
        {JSON.stringify(nvaMetadata, null, "\n").replace(/[\s]{2,}/g, "\n  ")}</pre> */
        }
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
