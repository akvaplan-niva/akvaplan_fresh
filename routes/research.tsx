import { getResearchLevel0 } from "akvaplan_fresh/services/research.ts";
import { search as searchPubs } from "akvaplan_fresh/services/dois.ts";
import { newsFromPubs } from "akvaplan_fresh/services/news_pubs.ts";
import {
  researchTopicURL,
  routesForLang,
} from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  AlbumHeader,
  ArticleSquare,
  //Card,
  HScroll,
  Page,
  //PeopleCard as PersonCard,
  //repeatAutoFitMinMaxGrid,
} from "akvaplan_fresh/components/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(research|forskning)",
};

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
const _header = {
  marginBlockStart: "1rem",
  marginBlockEnd: "0.5rem",
};

export const groupReducer = (fx) =>
(
  previous: Map<string, Array<unknown>>,
  current: unknown,
) => {
  const grp = fx(current);
  if (!previous.has(grp)) {
    previous.set(grp, [current]);
  } else {
    previous.set(grp, [...previous.get(grp) ?? [], current]);
  }
  return previous;
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);
    lang.value = params.lang;

    const title = t("nav.Research");
    const base = `/${params.lang}/${params.page}/`;

    const { groupname, filter } = params;
    const group = groupname?.length > 0 ? groupname : "year";
    const q = searchParams.get("q") ?? "";

    const topics = await getResearchLevel0(params.lang);

    const { data } = await searchPubs({ q, limit: 100 });
    const pubs = data;
    const researchArticles = data
      .filter(({ type }) => ["journal-article"].includes(type))
      .map(newsFromPubs({ lang: lang.value }));

    const grouped = pubs.reduce(
      groupReducer(({ published }) => published.substring(0, 7)),
      new Map(),
    );

    return ctx.render({
      lang,
      title,
      base,
      topics,
      researchArticles,
      pubs,
      grouped,
    });
  },
};

// const intro = (lang) =>
//   lang === "en"
//     ? (
//       <p>
//         Akvaplan-niva conducts research on sustainable aquaculture, arctic
//         ecosystems, environmental impacts, use of mobile observing platforms
//         environmental monitoring, and more. Our research is financed through
//         competitive grants from governmental research agencies, public
//         non-profit entities, and private companies.
//       </p>
//     )
//     : (
//       <p>
//         Akvaplan-niva forsker innen bærekraftig akvakultur, arktiske
//         økosystemer, miljøpåvirkninger, bruk av mobile observasjonsplattformer.
//         Forskningen finansieres gjennom konkurranseutsatte tilskudd fra
//         forskningsrådet, offentlige ideelle organisasjoner og private selskaper.
//       </p>
//     );

export default function Research(
  { data: { lang, title, base, topics, pubs, grouped, researchArticles } }:
    PageProps<
      unknown
    >,
) {
  return (
    <Page title={title} base={base}>
      <link rel="stylesheet" href="/css/hscroll.css" />
      <script src="/@nrk/core-scroll.min.js" />
      <h1>
        {title}
      </h1>

      <HScroll maxVisibleChildren={5.5}>
        {topics.map(ArticleSquare)}
      </HScroll>

      {
        /* <section style={_section}>
        <Card>
          <h1>{t("research.people.Header")}</h1>
          <p>
            {t("research.people.Intro")}
          </p>
          <div style={repeatAutoFitMinMaxGrid()}>
            <PersonCard id="aki" lang={lang} />
            <PersonCard id="aev" lang={lang} />
            <PersonCard id="gnc" lang={lang} />
            <PersonCard id="per" lang={lang} />
          </div>
        </Card>
      </section> */
      }

      <section>
        <AlbumHeader
          text={t("pubs.Latest_peer_reviewed_research_articles")}
          href={routesForLang(lang).get("pubs") + "?q=journal-article"}
        />
        <HScroll maxVisibleChildren={5.5}>
          {researchArticles.map(ArticleSquare)}
        </HScroll>
      </section>

      {
        /* <div style={{ fontSize: "1rem" }}>
        {[...grouped].filter((_, i) => i < 3).map(([grpkey, pubs]) => (
          <div>
            <h3>
              {grpkey}
            </h3>
            <ul>
              {pubs.map((slim) => <SlimCard slim={slim} lang={lang.value} />)}
            </ul>
          </div>
        ))}
      </div> */
      }
    </Page>
  );
}
