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
import { isDoiOrHandleUrl } from "akvaplan_fresh/services/pub.ts";
import { isNvaUrl } from "akvaplan_fresh/services/nva.ts";
import { isHandleUrl } from "akvaplan_fresh/services/handle.ts";
import { CCIcons } from "akvaplan_fresh/components/cc-icons.tsx";
import { Breadcrumbs } from "akvaplan_fresh/components/site_nav.tsx";
import pub from "akvaplan_fresh/routes/pub.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";

export const PubArticle = ({
  pub,
  lang,
}: { pub: SlimPublication; lang: string }) => {
  const {
    id,
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
    pdf,
    created,
    modified,
    abstract,
    open_access,
    open_access_status,
  } = pub;

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

      {(license && license?.length > 0) ||
          [true, false].includes(open_access) || open_access_status
        ? (
          <section
            style={{
              paddingTop: ".25rem",
              paddingBottom: ".25rem",
            }}
          >
            <Card>
              {[true, false].includes(open_access)
                ? (
                  <p>
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
                : <p>{t(`pubs.oa.${open_access_status}`)}</p>}
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
