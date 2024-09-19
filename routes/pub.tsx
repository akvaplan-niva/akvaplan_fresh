import { ApnSym, Card, Page } from "akvaplan_fresh/components/mod.ts";
import { defineRoute, type RouteConfig } from "$fresh/server.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { getPub } from "akvaplan_fresh/services/pub.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import { personURL } from "akvaplan_fresh/services/mod.ts";
export const config: RouteConfig = {
  routeOverride:
    "{/:lang(en|no)}?/(publikasjon|publication|pub)/:kind(doi|hdl|nva|hdl.handle.net)/:idx*",
};

const getUri = (kind: string, id: string) => {
  switch (kind) {
    case "doi":
      return new URL(id, "https://doi.org").href;
    case "hdl":
      return new URL(id, "https://hdl.handle.net").href;
    case "nva":
      return new URL(
        id,
        "https://api.test.nva.aws.unit.no/publication/",
      ).href;
    default:
      throw "Unsupported id scheme";
  }
};

export default defineRoute(async (req, ctx) => {
  const { params } = ctx;
  const { idx, lang, kind } = params;

  const uri = getUri(kind, idx);
  const r = await getPub(uri);

  if (r?.status === 404) {
    return ctx.renderNotFound();
  }
  const pub = await r.json();

  // const oramaId = oramaDocumenmtId(id, idtype);
  // const pub = await getOramaDocument(oramaId);
  // if (!pub) {
  //   return ctx.renderNotFound();
  // }

  const hreflang = pub?.lang ?? lang;
  const doi = "";
  const oa = true;

  const { container, title, published, image, authors } = pub;

  return (
    <Page title="" lang={lang}>
      <Card>
        <h1
          lang={hreflang}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <Pill>
          {pub.type}
        </Pill>
        {container && (
          <p>
            <em dangerouslySetInnerHTML={{ __html: container }} />{" "}
            (<time>{published}</time>)
          </p>
        )}
        <p>
          <a
            target="_blank"
            href={pub.id}
          >
            {pub.id}
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

      <Section
        style={{
          paddingTop: ".75rem",
          paddingBottom: ".75rem",
          fontSize: ".75rem",
        }}
      >
        <Card>
          <dl style={{ fontSize: "1rem" }}>
            {authors?.map((
              { name, given, family, identity },
              n,
            ) => (
              <>
                <dt>
                  {identity
                    ? (
                      <span>
                        <a
                          href={personURL(
                            { id: identity.id, given, family },
                            lang,
                          )}
                        >
                          {name}
                        </a>{" "}
                        <ApnSym
                          width="1rem"
                          height="1rem"
                          style={identity.prior
                            ? { filter: "grayscale(1)" }
                            : {}}
                        />
                      </span>
                    )
                    : <span>{name}</span>}
                </dt>
              </>
            ))}
          </dl>
        </Card>
      </Section>

      {
        /* <Card>
        <pre>{JSON.stringify(pub, null, "  ")}</pre>
      </Card> */
      }
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
