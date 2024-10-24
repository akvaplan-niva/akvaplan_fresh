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

// FIXME _authors vs authors, switch: use _authors for string[] for orama indexing and authors for {family,given}[]
//authors,
export const PubArticle = ({
  pub: {
    id,
    container,
    type,
    nva,
    title,
    published,
    _authors,
    contributors,
    license,
    akvaplanists,
    url,
    pdf,
    created,
    modified,
  },
  lang,
}: { pub: SlimPublication; lang: string }) => (
  <article
    style={{
      fontSize: "1rem",
    }}
  >
    <p style={{ fontSize: ".75rem" }}>
      <a href={pubsURL({ lang }) + `?q=${type}&filter-type=${type}`}>
        {t(
          isHandleUrl(id) || isNvaUrl(id) ? `nva.${type}` : `type.${type}`,
        )}
      </a>
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

        <section
          style={{
            paddingTop: ".25rem",
            paddingBottom: ".25rem",
          }}
        >
          {_authors?.length > 0 && (
            <Card>
              <details open>
                <summary style={{ paddingBottom: ".5rem" }}>
                  {_authors?.length > 1 ? t("pubs.Authors") : t("pubs.Author")}
                  {" "}
                  ({_authors.length})
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
