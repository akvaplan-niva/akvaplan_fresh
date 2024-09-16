import { getOramaDocument } from "akvaplan_fresh/search/orama.ts";
import { Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/(publikasjon|publication|pub)/:idtype(hdl|nva|hdl.handle.net)/:id*",
};

const oramaDocumenmtId = (id: string, idtype: string) => {
  switch (idtype) {
    case "hdl":
      return new URL(id, "https://hdl.handle.net").href;
    case "nva":
      return new URL(
        id,
        "https://api.test.nva.aws.unit.no/publication/01907a6d1b48-247e3e2c-d315-4236-b358-e74db3248f6f",
      ).href;
  }
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { id, lang, idtype } = params;

  const oramaId = oramaDocumenmtId(id, idtype);
  const pub = await getOramaDocument(oramaId);
  if (!pub) {
    return ctx.renderNotFound();
  }

  const hreflang = pub?.lang ?? lang;
  const doi = "";
  const oa = true;

  const { container, title, printed, published, image } = pub;

  return (
    <Page title="" lang={lang}>
      <Card>
        <h1
          lang={hreflang}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p>
          <em dangerouslySetInnerHTML={{ __html: container || "?" }} />{" "}
          (<time>{printed ?? published}</time>)
        </p>
        <p>
          <a
            target="_blank"
            href={`https://doi.org/${doi}`}
          >
            https://doi.org/{doi}
          </a>
        </p>
        {oa === true ? t("pubs.oa") : null}

        <p>
          {image && (
            <img
              src={image}
              alt={t("")}
              width="400"
            />
          )}
        </p>
      </Card>

      <Section style={{ paddingTop: ".75rem", fontSize: ".75rem" }}>
        <Card>
          <pre>{JSON.stringify(pub, null, "  ")}</pre>
        </Card>
      </Section>
      <Section>
        <dl>
          <dt></dt>
          <dd></dd>
        </dl>
      </Section>
    </Page>
  );
});

/**
Year: 2014
Type: article
Abstract: One predicted consequence of global warming is an increased frequency of extreme weather events, such as heat waves, droughts, or heavy rainfalls. In parts of the Arctic, extreme warm spells and heavy... more
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
