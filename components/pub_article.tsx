import { t } from "akvaplan_fresh/text/mod.ts";

import { Button } from "akvaplan_fresh/components/button/button.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import {
  AkvaplanistCounts,
  Contributors,
} from "akvaplan_fresh/components/contribs.tsx";
//import { Section } from "akvaplan_fresh/components/section.tsx";

import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";
import {
  extractSources,
  isDoiOrHandleUrl,
} from "akvaplan_fresh/services/pub.ts";
import { nvaPublicationLanding } from "akvaplan_fresh/services/nva.ts";
import { CCIcons } from "akvaplan_fresh/components/cc-icons.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

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
    parent,
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

  const sources = extractSources(pub);
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
          <p>{typeText}</p>
          <p>
            {parent
              ? (
                <span>
                  {t("pubs.Published_in")}: <a href={parent}>{parent}</a>
                </span>
              )
              : null}
          </p>
        </Card>
      </section>

      {(license && license?.length > 0) ||
          [true, false].includes(open_access) ||
          open_access_status !== "unknown"
        ? (
          <section
            style={{
              paddingTop: ".25rem",
            }}
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

      <section
        style={{
          paddingTop: ".25rem",
          paddingBottom: ".25rem",
        }}
      >
        <Card>
          <p style={{ fontSize: ".75rem" }}>
            {sources.size === 1 ? t("pubs.Source") : t("pubs.Sources")}:
            {[...sources].map(([text, href], i) => (
              <span>
                <a href={href} target="_blank">{text}</a>
                {sources.size === 1 || sources.size - 1 === i ? " " : ", "}
              </span>
            ))}
          </p>
        </Card>
      </section>
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
