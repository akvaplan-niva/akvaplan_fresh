// FIXME akvaplanist.tsx – add noindex,nofollow on anything but root route to avoid search engine clutter
// @todo inspiration/link: https://openalex.org/works?sort=publication_date%3Adesc&column=display_name,publication_year,type,open_access.is_oa,cited_by_count&page=1&filter=authorships.author.id%3AA5053761479
// https://openalex.org/authors/A5053761479
import {
  akvaplanists,
  buildGroupFX,
  buildPeopleGrouper,
  cristinAppPersonURL,
  cristinAppWorksURL,
  findAkvaplanistInCristin,
  //groupByChar0,
  getAugmentedAkvaplanists,
  newsOnPerson,
  offices,
  priorAkvaplanistID,
  pubsFromPersonGroupedByYear,
} from "akvaplan_fresh/services/mod.ts";

import {
  AlbumHeader,
  ApnSym,
  ArticleSquare,
  Card,
  GroupedPeople,
  HScroll,
  NewsFilmStrip,
  OfficeCard,
  OnePersonGroup,
  Page,
  PeopleSearchForm,
} from "akvaplan_fresh/components/mod.ts";

import { akvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { buildContainsFilter } from "akvaplan_fresh/search/filter.ts";
import { lang, normalize, t } from "akvaplan_fresh/text/mod.ts";

import { type Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";

import { Head } from "$fresh/runtime.ts";
import { priorAkvaplanists } from "../services/prior_akvaplanists.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";

interface AkvaplanistsRouteProps {
  people: Akvaplanist[];

  results: Akvaplanist[];

  group: string;

  filter: string;

  grouped: Map<string, Akvaplanist[]>;
  lang: string;
  base: string;
  title: string;
  q?: string;
}

const _section = { padding: 0 };

const findGroup = (groupname) => {
  if ("ledelse" === groupname) {
    return "management";
  }
  return groupname?.length > 0 ? groupname : "given0";
};

const getSortKey = (key: string) => {
  switch (key) {
    case "given0":
      return "given";
    case "family0":
      return "family";
    default:
      return key;
  }
};

const buildSort = (
  { lang, sortkey, sortdir },
) => {
  const { compare } = new Intl.Collator(lang);
  return (a: Akvaplanist, b: Akvaplanist) =>
    sortdir * compare(a?.[sortkey], b?.[sortkey]);
};

export const config: RouteConfig = {
  routeOverride:
    "{/:lang}?/:page(people|folk|ansatte|employees|akvaplanist|person){/:groupname}?{/:filter}?{/:fn}?{/:gn}?",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;

    const groupname = decodeURIComponent(params.groupname);
    const filter = decodeURIComponent(params.filter);
    //const { groupname, filter } = params;
    const group = findGroup(groupname);

    // lang is optional for legacy URL (/ansatte)
    lang.value = ["en", "no"].includes(params.lang) ? params.lang : "no";

    const page = ["employees", "people"].includes(params.page)
      ? "people"
      : "folk";

    const fx = buildGroupFX({ group, filter });
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    const _all = await akvaplanists();
    _all.filter(({ expired }) => expired ? true : false)
      .map(({ id, family, given }) =>
        priorAkvaplanistID.set(id, { family, given, id })
      );

    const unsorted = _all.filter(({ expired }) => expired ? false : true);
    const sortkey = getSortKey(searchParams.get("sort") ?? group);
    const sortdir = searchParams.get("sortdir") ?? 1;

    const sorted = unsorted.sort(
      buildSort({ lang: lang.value, sortkey, sortdir }),
    );
    // const news = (await searchNews({ q: "", lang: "no", limit: 64 })).filter((
    //   { type },
    // ) => "person" === type);

    const filtered = (filter?.length > 0)
      ? [...sorted].filter((p: Akvaplanist) =>
        normalize(p?.[group]) === normalize(filter)
      )
      : sorted;
    const queryFilter = q?.length > 0 ? buildContainsFilter(q) : () => true;
    const results = filtered.filter(queryFilter);

    const grouped = results.reduce(
      buildPeopleGrouper(fx),
      new Map(),
    );

    const title = t("people.People");

    const base = `/${lang}/${page}/${group}`;

    let person = ("id" === group && results.length === 1) ? results.at(0) : {};

    if (results?.length === 0 && filter) {
      if (["id", "name"].includes(group)) {
        if (priorAkvaplanistID.has(filter)) {
          const prior = priorAkvaplanistID.get(filter);
          person = { prior: true, family: prior.family, given: prior.given };
          results[0] = person;
        } else {
          // @todo The route params :fn :gn must be fixed, and single person routes must
          const prior = priorAkvaplanists.find(({ given, family }) =>
            family === filter &&
            given === params.fn
          );
          if (prior) {
            person = { prior: true, family: prior.family, given: prior.given };
            results[0] = prior;
          }
        }
      }
    }

    if (person && !person.cristin) {
      person.cristin = await findAkvaplanistInCristin(person);
    }

    //@todo separate route for 1 person!?
    const news = (person && person.family)
      ? await newsOnPerson({ person, lang: params.lang })
      : [];

    const pubsByYear = (person && person.family)
      ? await pubsFromPersonGroupedByYear({ person, lang: params.lang })
      : [];

    const numPubs = [...pubsByYear.values()].map((a) => a.length).reduce(
      (p, c) => p += c,
      0,
    );

    const office = group === "workplace" ? offices.get(filter) : null;

    return ctx.render({
      lang,
      base,
      title,
      total: unsorted.length,
      grouped,
      group,
      filter,
      results,
      news,
      person,
      pubsByYear,
      numPubs,
      q,
      office,
      searchParams,
    });
  },
};

const before = "bb7x8e4rmevc5kboua8e";
const frida = "viemsy7cszuo7laedtcd";
const id = frida;

const banner =
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_1782,ar_6:1/${id}`;

const Picture = () => (
  <picture>
    <source media="(min-width: 1024px)" srcset={banner} />
    <source
      media="(max-width: 1023px)"
      srcset={`https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,q_auto:good,w_512,ar_3:1/${id}`}
    />
    <img
      src={banner}
      alt=""
    />
  </picture>
);

// <img src={banner} alt={caption} title={caption} />
// alt H1TTitle with group as prefix to translation: <h1>{t(`${group}.${filter}`)} / <a href=".">{text}</a>
const H1ATitle = ({ filter, text, group }) =>
  filter?.length > 0
    ? (
      <h1>
        {t(`${filter}`)} / <a href=".">{text}</a>
      </h1>
    )
    : (
      <h1>
        <a href=".">{text}</a>
      </h1>
    );

export default function Akvaplanists(
  {
    data: {
      lang,
      base,
      title,
      total,
      grouped,
      group,
      filter,
      results,
      q,
      person,
      news,
      pubsByYear,
      numPubs,
      office,
      searchParams,
    },
  }: PageProps<
    AkvaplanistsRouteProps
  >,
) {
  let pagetitle = filter?.length > 0
    ? `${group}.${t(filter)} / ${t("People")}`
    : t("People");

  if (person && "id" === group) {
    pagetitle = `${person.given} ${person.family}`;
  }

  const caption = "";

  const subtitle = "";
  // filter?.length === 0
  //   ? String(t("people.subtitle")).replace(
  //     "%i",
  //     total,
  //   )
  //   : "";

  return (
    <Page title={pagetitle} base={base}>
      <Head>
        <link rel="stylesheet" href="/css/hscroll.css" />
        <link rel="stylesheet" href="/css/akvaplanist.css" />
        <script src="/@nrk/core-scroll.min.js" />
      </Head>

      {group === "workplace" && office && (
        <section class="page-header">
          <H1ATitle
            group={group}
            filter={filter}
            text={t("people.People")}
          />
          <OfficeCard office={office} />
        </section>
      )}

      {!["id", "name", "workplace"].includes(group) &&
        (
          <section class="page-header">
            {/* <NewsFilmStrip news={news} lang={lang.value} /> */}
            <div class="page-header__content">
              <H1ATitle
                group={group}
                filter={filter}
                text={t("people.People")}
              />
              {/* <p>{t("people.subtitle")}</p> */}
            </div>
            <Picture />
          </section>
        )}

      {filter?.length > 0 ? <OnePersonGroup members={results} /> : (
        <>
          <PeopleSearchForm
            q={q}
            sortdir={searchParams.get("sortdir")}
            group={group}
          />
          <GroupedPeople group={group} grouped={grouped} />
        </>
      )}

      {person?.bios && (
        <section class="page-header">
          <Card>
            <div
              class="markdown-body"
              dangerouslySetInnerHTML={{ __html: person.bios }}
            />
          </Card>
        </section>
      )}

      <section>
        <HScroll maxVisibleChildren={5.5}>{news.map(ArticleSquare)}</HScroll>
      </section>

      {pubsByYear.size > 0 && (
        <section>
          <h1>{t("pubs.Pubs")} ({numPubs})</h1>

          <div style={{ fontSize: "1rem" }}>
            {[...pubsByYear].map(([grpkey, grppubs], i) => (
              <div>
                <h3>
                  {grpkey} ({grppubs.length})
                </h3>
                <NewsFilmStrip
                  news={grppubs}
                  lang={lang}
                />
              </div>
            ))}
          </div>
          {person?.cristin && (
            <div>
              {t("pubs.Also_view")}{" "}
              <a href={cristinAppWorksURL(person.cristin)} target="_blank">
                {t("pubs.works")}
              </a>{" "}
              {t("pubs.and")}{" "}
              <a href={cristinAppPersonURL(person.cristin)} target="_blank">
                {t("pubs.person")}
              </a>{" "}
              {t("pubs.in")}{" "}
              <abbr
                title="Current Research Information System in Norway"
                lang="en"
              >
                CRISTIN
              </abbr>
            </div>
          )}
        </section>
      )}

      {filter?.length > 0
        ? <LinkBackToCollection collection={"people"} lang={lang} />
        : null}
    </Page>
  );
}
