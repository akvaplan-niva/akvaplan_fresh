import { t } from "akvaplan_fresh/text/mod.ts";
import { pubsURL } from "akvaplan_fresh/services/nav.ts";

import { Button } from "akvaplan_fresh/components/button/button.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import {
  AkvaplanistCounts,
  Contributors,
} from "akvaplan_fresh/components/contribs.tsx";
//import { Section } from "akvaplan_fresh/components/section.tsx";

import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
import { isDoiOrHandleUrl, isDoiUrl } from "akvaplan_fresh/services/pub.ts";
import {
  isNvaUrl,
  nvaPublicationLanding,
} from "akvaplan_fresh/services/nva.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { CCIcons } from "akvaplan_fresh/components/cc-icons.tsx";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";
import pub from "akvaplan_fresh/routes/pub.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { extractNakedDoi } from "../services/dois.ts";

export const PubArticle = ({
  pub,
  lang,
}: { pub: SlimPublication; lang: string }) => {
  const {
    id,
    container,
    code,
    type,
    nva,
    title,
    published,
    authors,
    contributors,
    license,
    akvaplanists,
    pdf,
    created,
    modified,
    abstract,
    // open_access,
    open_access_status,
    reg,
  } = pub;

  const [first, ...rest] = t(`nva.${type}`);
  const typeText = [first.toUpperCase(), ...rest].join("");

  const open_access = license ? true : pub?.open_access;
  const url = pub?.url?.startsWith("http")
    ? pub.url
    : nva
    ? nvaPublicationLanding(nva).href
    : "";

  const sources = [
    isDoiUrl(id) && reg
      ? [reg, `https://api.crossref.org/works/${extractNakedDoi(id)}`]
      : null,
    isDoiUrl(id)
      ? [
        "OpenAlex",
        `https://openalex.org/works?page=1&filter=doi:${id}&sort=publication_year:desc}`,
      ]
      : null,
    nva && [t("NVA"), nvaPublicationLanding(nva)],
  ].filter((i) => i !== null);

  return (
    <article
      style={{
        fontSize: "1rem",
      }}
    >
      <Card>
        <h1
          style={{ fontSize: "1.75rem" }}
          dangerouslySetInnerHTML={{ __html: title }}
        />

        <p>
          <em dangerouslySetInnerHTML={{ __html: container ?? "" }} />

          {code ? ` ${code} ` : " "}
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

      <section
        style={{
          paddingTop: ".25rem",
        }}
      >
        <Card style={{ fontSize: "1rem" }}>
          {typeText}
        </Card>
      </section>

      <section
        style={{
          paddingTop: ".25rem",
          paddingBottom: ".25rem",
        }}
      >
        <Card>
          <p style={{ fontSize: ".75rem" }}>
            {sources.length === 1 ? t("pubs.Source") : t("pubs.Sources")}:

            {sources.map(([text, href], i) => (
              <span>
                <a href={href} target="_blank">{text}</a>
                {sources.length - 1 === i ? "" : ", "}
              </span>
            ))}
          </p>
        </Card>
      </section>

      {(license && license?.length > 0) ||
          [true, false].includes(open_access) ||
          open_access_status !== "unknown"
        ? (
          <section
            // style={{
            //   paddingTop: ".25rem",
            //   paddingBottom: ".25rem",
            // }}
          >
            <Card>
              {[true, false].includes(open_access)
                ? (
                  <p style={{ "font-size": "0.75rem" }}>
                    {true === open_access
                      ? (
                        <>
                          {t("pubs.Open_access")} (<abbr
                            title={t(
                              `pubs.oa.abbr.${open_access_status}`,
                            )}
                          >
                            {t(
                              `pubs.oa.${open_access_status}`,
                            )}
                          </abbr>)
                        </>
                      )
                      : t("pubs.Closed_access")}
                  </p>
                )
                : (
                  <p style={{ "font-size": "0.75rem" }}>
                    {t(`pubs.oa.${open_access_status}`)}
                  </p>
                )}
            </Card>
            {license && license?.length > 0
              ? (
                <Card>
                  <CCIcons code={license} lang={lang} />
                </Card>
              )
              : null}
          </section>
        )
        : null}

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

          <section
            style={{
              paddingTop: ".25rem",
              paddingBottom: ".25rem",
            }}
          >
            {authors?.length > 0 && (
              <Card>
                <details open>
                  <summary style={{ paddingBottom: ".5rem" }}>
                    {authors?.length > 1 ? t("pubs.Authors") : t("pubs.Author")}
                    {" "}
                    ({authors.length})
                  </summary>
                  <Contributors
                    contributors={authors}
                    akvaplanists={akvaplanists}
                    lang={lang}
                  />
                </details>
              </Card>
            )}

            {contributors?.length > 0 && (
              <Card>
                <details open>
                  <summary style={{ paddingBottom: ".5rem" }}>
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
          </section>

          {abstract
            ? (
              <Section>
                <h2>{t("Abstract")}</h2>
                <p
                  dangerouslySetInnerHTML={{ __html: abstract }}
                  style={{
                    maxWidth: "120ch",
                    fontSize: "1rem",
                    whiteSpace: "pre-wrap",
                  }}
                />
              </Section>
            )
            : null}

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
        </div>
      </div>
    </article>
  );
};
