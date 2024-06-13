import { Page } from "akvaplan_fresh/components/mod.ts";
import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";
import { PageProps } from "$fresh/server.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";

const _extract = (url: URL) => url.pathname.replaceAll("/", " ").trim();

export default function NotFoundPage({ url, data }: PageProps) {
  const title = "Unknown URL";
  return (
    <html>
      <Page title="404 Not Found">
        <main
          style={{
            // fontFamily: "monospace",
            // display: "grid",
            // placeItems: "center",
            // gridTemplateColumns: "1fr",
          }}
        >
          <h1>{title}</h1>
          <p>
            <code>
              {url.href}
              {" "}
            </code>
          </p>
        </main>
        <GroupedSearch
          limit={3}
          term={data && data.query ? data.query : _extract(url)}
          origin={url}
          threshold={0.5}
        />
      </Page>
    </html>
  );
}
