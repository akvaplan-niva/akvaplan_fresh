import { documentHref } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { ArticleSquare, Page } from "akvaplan_fresh/components/mod.ts";

import { type InternationalProps } from "akvaplan_fresh/utils/page/international_page.ts";

interface DocumentsProps extends InternationalProps {
  style: StyleProps;
  docs: MynewsdeskItem[];
}
interface StyleProps {
  section: string;
  header: string;
}

const itemstyle = {
  display: "grid",
  padding: "var(--size-1)",

  "font-size": "var(--font-size-1)",
  gap: "var(--size-2)",
  "place-items": "center",
  "grid-template-columns": "128px auto",
};

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { searchMynewsdeskAndMarkdownDocuments } from "akvaplan_fresh/services/documents.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(documents|document|dokumenter|dokument)",
};

const { compare } = Intl.Collator("no", {
  usage: "sort",
  ignorePunctuation: true,
  sensitivity: "case",
});
const sortPublishedReverse = (a, b) =>
  new Date(b?.published).getTime() - new Date(a?.published).getTime();

export const handler: Handlers<DocumentsProps> = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.Documents");

    const { searchParams } = new URL(req.url);
    const _q = searchParams.get("q") ?? "";
    const q = _q.toLocaleLowerCase();
    const filter = ({ summary, document_format }: MynewsdeskDocument) =>
      (true || summary?.length > 0) && /pdf/.test(document_format);

    const docs = (await searchMynewsdeskAndMarkdownDocuments({ q, filter }))
      .sort(
        sortPublishedReverse,
      );
    return ctx.render({ title, base, docs, lang });
  },
};

const style: StyleProps = { section: "", header: "" };

export default function DocumentsPage(
  { data: { title, lang, base, docs } }: PageProps<DocumentsProps>,
) {
  return (
    <Page title={title} base={base} lang={lang} collection="home">
      <h1 style={style.header}>{title}</h1>

      <form
        id="pubs-search"
        autocomplete="off"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginTop: "0.25rem",
        }}
      >
        <label for="pubs-search" style={{ fontSize: "1rem", display: "none" }}>
          {t("pubs.search.Label")}
        </label>
        {
          /* <InputSearch
          type="search"
          heigth="3rem"
          name="q"
          placeholder={t("pubs.search.placeholder")}
          value={""}
          _onInput={"handleSearch"}
        /> */
        }
        <div>
          {
            /* {["policy"].map((y) => (
            <Pill
              value={y}
              _selected={false}
              _onClick={"handleYearClic2"}
            >
              {y}
            </Pill>
          ))} */
          }
        </div>
      </form>
      <main
        style={{
          display: "grid",
          gap: "1rem",
          marginBlockStart: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {docs.map((
          {
            id,
            href,
            url,
            title,
            thumb,
            published,
          },
        ) => (
          <ArticleSquare
            title={title}
            img={thumb}
            published={published}
            href={documentHref({
              id: url ? url.split("-").at(-1) : id,
              title,
              lang,
            })}
            width="320"
            height="320"
            maxWidth="320px"
          />
        ))}
      </main>
    </Page>
  );
}
