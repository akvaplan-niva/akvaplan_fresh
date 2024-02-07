// FIXME /no/doi/10.1093/icesjms/fsaa243
// FIXME http://localhost:7777/no/doi/10.1093/icesjms/fsad192
export {
  handler as _handler,
  type InternationalProps,
  style,
} from "akvaplan_fresh/utils/page/international_page.ts";

import {
  //buildoiNewsMap,
  doiImage,
  findAkvaplanist,
  findPriorAkvaplanist,
  getOpenAlexWork,
  getSlimPublication,
  personURL,
  pubsURL,
} from "akvaplan_fresh/services/mod.ts";

import { isodate } from "akvaplan_fresh/utils/mod.ts";

import { ApnSym, Card, Icon, Page } from "akvaplan_fresh/components/mod.ts";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";

import { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

import {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

//import { Akvaplanist } from "../@interfaces/akvaplanist.ts";

//import { Head } from "$fresh/runtime.ts";

export const config: RouteConfig = {
  routeOverride: "{/:lang(en|no)}?/doi/:prefix/:suffix0/:extra*",
};

const doiFromParams = (params: Record<string, string>) => {
  const { suffix0, extra, prefix } = params;
  const suffix = !extra ? suffix0 : `${suffix0}/${extra}`;
  return `${prefix}/${suffix}`;
};

export const handler: Handlers<SlimPublication> = {
  async GET(request: Request, ctx: FreshContext) {
    const { params } = ctx;
    const lang = params.lang;

    langSignal.value = lang;

    const doi = doiFromParams(params);
    const slim = await getSlimPublication(doi);

    if (slim || doi) {
      //const news = await buildoiNewsMap() ?? {};
      const openalex = await getOpenAlexWork({ doi }) ?? { open_access: {} };
      if (!openalex && !slim) {
        return ctx.renderNotFound();
      }
      const image = slim?.figures?.[0].src ?? doiImage.get(doi);

      let i = 0;
      let current = 0;
      let priors = 0;
      for await (const person of (slim?.authors ?? [])) {
        const { given, family, name } = person;
        person.name = name ?? `${given ?? ""} ${family}`;
        const { id } = await findAkvaplanist({ given, family }) ?? {};
        if (id) {
          current++;
          person.id = id;
        } else {
          const prior = await findPriorAkvaplanist({ given, family });

          if (prior) {
            priors++;
            person.prior = true;
            //console.debug({ prior, given, family });
            if (prior.id) {
              person.id = prior.id;
            }
          }
        }
        slim.authors[i++] = person;
      }

      return ctx.render({ slim, openalex, lang, image, current, priors });
    } else {
      return ctx.renderNotFound();
    }
  },
};
export default function DoiPublication(
  { params, data: { slim, openalex, lang, image, current, priors } }: PageProps<
    { slim: SlimPublication; image: string }
  >,
) {
  let {
    title,
    type,
    license,
    printed,
    published,
    container,
    authors,
    doi,
    cites,
    ...rest
  } = slim ?? {};

  const {
    open_access: {
      is_retracted,
      is_paratext,
      is_oa,
      oa_status,
      oa_url,
      any_repository_has_fulltext,
    },
  } = openalex;
  const oa = license && /cc/i.test(license) ? true : oa_status;
  const pdf = slim?.pdf || oa_url;
  const href = `https://doi.org/${doi}`;
  title = title ?? openalex?.title;
  type = type ?? openalex?.type;
  doi = doi ?? openalex?.doi?.split("doi.org/").at(1);
  cites = openalex?.cited_by_count ?? cites; // openalex is continously updated
  const hreflang = slim?.lang ?? openalex?.language ?? "en";

  return (
    <Page title={title}>
      {!slim && (
        <p style="display:grid; grid-gap: 0.25rem; grid-template-columns: 48px auto; align-items: center;">
          <Icon name="sms_failed" />
          <span>
            This work is not part of Akvaplan-niva's corpus
          </span>
        </p>
      )}
      <article>
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
        <div style={{ marginTop: "2rem" }} />
        <Card>
          <h2>
            {authors?.length > 1 ? t("pubs.Authors") : t("pubs.Author")}
          </h2>
          {current > 0 && (
            <p style={{ fontSize: "1rem" }}>
              <ApnSym width="1rem" height="1rem" /> {current > 0 && current}
              {" "}
              Akvaplan-niva ({t("people.akvaplanist(now)")})
            </p>
          )}
          {priors > 0 && (
            <p style={{ fontSize: "1rem" }}>
              <ApnSym
                width="1rem"
                height="1rem"
                style="filter: grayscale(1)"
              />{" "}
              {priors > 0 && priors}{" "}
              Akvaplan-niva ({t("people.akvaplanist(prior)")})
            </p>
          )}
          <dl style={{ fontSize: "1rem" }}>
            {authors?.map(({ name, given, family, id, prior }, n) => (
              <>
                <dt>
                  {id || prior
                    ? (
                      <span>
                        <a href={personURL({ id, given, family, lang })}>
                          {name}
                        </a>{" "}
                        <ApnSym
                          width="1rem"
                          height="1rem"
                          style={prior ? { filter: "grayscale(1)" } : {}}
                        />
                      </span>
                    )
                    : <span>{name}</span>}
                </dt>

                {openalex?.authorships?.at(n)?.institutions.map((
                  { display_name, id, ror, country_code, type, ...r },
                ) => <dd lang="en">{display_name}</dd>)}
              </>
            ))}
          </dl>
        </Card>
        <div style={{ marginTop: "2rem" }} />
        <Card>
          <h2>
            Metadata
          </h2>
          <dl class="ellipsis" style={{ fontSize: "1rem" }}>
            <dt>type</dt>
            <dd>{t(`type.${type}`)}</dd>

            <dt>{t("pubs.license")}</dt>
            <dd>
              {license ? license.toUpperCase() : t("ui.unknown")}
            </dd>

            <dt>language</dt>
            <dd>{t(`lang.${openalex?.language}`)}</dd>

            {pdf && (
              <>
                <dt>{t("pubs.fulltext")}</dt>
                <dd>
                  <a download href={pdf} hreflang={hreflang}>{pdf}</a>
                </dd>
              </>
            )}

            <dt>{t("pubs.cites")}</dt>
            <dd>
              {cites}
            </dd>

            <dt>{t("pubs.funding")}</dt>
            {openalex?.grants?.map(({ funder_display_name, award_id }) => (
              <dd>{funder_display_name} {award_id && `: ${award_id}`}</dd>
            ))}

            <dt>{t("pubs.linked_data")}</dt>
            <dd>
              <a href={`https://api.crossref.org/works/${doi}`}>Crossref</a>
            </dd>
            <dd>
              <a
                target="_blank"
                hrefLang="en"
                href={openalex?.id?.replace("https://", "https://api.")}
              >
                OpenAlex
              </a>
            </dd>
            <dt>{t("ui.updated")}</dt>
            <dd>
              {isodate(openalex.updated_date)}
            </dd>
          </dl>
        </Card>

        <LinkBackToCollection collection="pubs" lang={lang} />
      </article>
    </Page>
  );
}

// FIXME: DOI from hell: /no/doi/10.1577/1548-8659(1994)123%3C0385:spbpac%3E2.3.co;2
