import { longDate } from "akvaplan_fresh/time/mod.ts";
import { getNvaMetadata } from "akvaplan_fresh/services/nva.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import {
  buildCanonicalUri,
  getPubFromAkvaplanService,
} from "akvaplan_fresh/services/pub.ts";
import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";

import { PubArticle } from "akvaplan_fresh/components/pub_article.tsx";
import { PubNvaPdfAugment } from "akvaplan_fresh/islands/pub_nva_pdf_augment.tsx";
import { Page } from "akvaplan_fresh/components/mod.ts";

import { defineRoute, type RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/:collection(publikasjon|publication|pub){/:kind(doi|hdl|nva|hdl\.handle\.net)}?/:idx*",
};
export default defineRoute(async (_req, ctx) => {
  const { params } = ctx;
  const { collection, lang, kind, idx } = params;
  const scheme = idx?.startsWith("10.") ? "doi" : kind;

  const id = buildCanonicalUri(scheme, idx);
  let pub = await getOramaDocument(id);
  if (!pub) {
    // In case orama index is out-dated, or in rare cases like 10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
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
  // FIXME Move NVA fetch to browser island (requires adding CORS to Akvaplan pubs service, or using a CORS proxy)
  const nvaPublication = nva ? await getNvaMetadata(nva) : undefined;

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
      {nva && <PubNvaPdfAugment publication={nvaPublication} lang={lang} />}
      <p style={{ fontSize: ".75rem" }}>
        {t("time.Created")} <time>{longDate(created, lang)}</time>
        , {t("time.modified")} <time>{longDate(modified, lang)}</time>
      </p>
    </Page>
  );
});
