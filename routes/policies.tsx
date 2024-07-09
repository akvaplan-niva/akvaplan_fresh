import { lang } from "akvaplan_fresh/text/mod.ts";
import { Page } from "akvaplan_fresh/components/page.tsx";

import type { InternationalProps } from "akvaplan_fresh/utils/page/international_page.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import { MynewsdeskItem } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(policies)",
};

export const handler: Handlers<InternationalProps> = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = "Policies"; //t("nav.Policies");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();

    const { items } = await searchMynewsdesk({
      q,
      sort: "created",
      limit: 480,
      type_of_media: "documents",
    }) ?? [];

    const _docs = q?.length > 1
      ? items
      : items.filter(({ summary, document_format }: MynewsdeskItem) =>
        summary?.length > 0 && /pdf/.test(document_format)
      );
    const docs = _docs?.map((d) => {
      const { document } = d;
      return d;
    });
    return ctx.render({ title, base, docs, lang });
  },
};

export default function Policies(
  { data: { title, lang, base, docs } }: PageProps<
    InternationalProps & { docs: Record<string, unknown>[] }
  >,
) {
  return (
    <Page title={title} base={base} lang={lang}>
      <h1>{title}</h1>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr",
        }}
      >
        {docs.map((
          {
            id,
            header,
            document,
            document_thumbnail,
            document_name,
            document_size,
            document_format,
            published_at,
            created_at,
            updated_at,
            url,
            summary,
            tags,
            ...more
          },
        ) => (
          <div>
            <header>{summary ?? document_name}</header>
            <a href={`/no/dokument/${id}`}>{id} [{header}]</a>
          </div>
        ))}
      </section>
    </Page>
  );
}

// img={document_thumbnail}
// published={new Date(published_at.datetime)}
// type={t(document_format.replace(".", ""))}
// href={document}
// target="_blank" _type={"document"}
