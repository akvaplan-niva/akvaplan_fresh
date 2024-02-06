import { documentHref, searchMynewsdesk } from "akvaplan_fresh/services/mod.ts";
import { groupIntoMap } from "akvaplan_fresh/grouping/mod.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { isodate } from "../time/mod.ts";

import {
  ArticleSquare,
  Card,
  MiniNewsCard,
  Page,
} from "akvaplan_fresh/components/mod.ts";

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
import { InputSearch } from "../components/search/InputSearch.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import { searchDocuments } from "akvaplan_fresh/services/documents.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(documents|document|dokumenter|dokument)",
};

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
      summary?.length > 0 && /pdf/.test(document_format);
    const docs = await searchDocuments({ q, filter });
    return ctx.render({ title, base, docs, lang });
  },
};

const style: StyleProps = { section: "", header: "" };
{
  /*
Datapolitikk
Kvalitetspolicy og etiske retningslinjer
Vilkår (for kjøp av tjenester)
Arbeid for likestilling og mot diskriminering
Likestillingsplan
Redegjørelse Åpenhetsloven (Norwegian) */
}

export default function Documents(
  { data: { title, lang, base, docs } }: PageProps<DocumentsProps>,
) {
  return (
    <Page title={title} base={base} lang={lang}>
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
            title,
            thumb,
            published,
          },
        ) => (
          <ArticleSquare
            title={title}
            img={thumb}
            published={published}
            href={documentHref({ id, title, lang })}
            width="320"
            height="320"
            maxWidth="320px"
          />
        ))}
      </main>
    </Page>
  );
}
