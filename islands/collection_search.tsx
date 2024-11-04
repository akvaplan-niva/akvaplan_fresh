import { searchViaApi } from "../search/search_via_api.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { decadesFacet } from "akvaplan_fresh/search/search.ts";
import { cachedNameOf } from "akvaplan_fresh/services/akvaplanist.ts";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";

import { InputSearch } from "../components/search/InputSearch.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { computed, useSignal } from "@preact/signals";
import { Facets } from "./facets.tsx";

const detailsOpen = (collection: string) =>
  ["image", "document", "video", "blog", "pubs"].includes(collection)
    ? false
    : true;

const collectionHref = ({ collection, lang }) => {
  if (!intlRouteMap(lang).has(collection)) {
    console.error("Missing collectionHref", collection, lang);
  }
  return intlRouteMap(lang).get(collection);
};

const highestCountFirst = (a, b) => b[1] - a[1];

const facetMapper = (facets, { limit = -1, sort = highestCountFirst } = {}) =>
  Object.entries(facets ?? {}).flatMap((
    [facet, { values }],
  ) => ({
    facet,
    groups: Object.entries(values)
      .sort(highestCountFirst)
      //.slice(0, limit)
      .map(([label, count]) => ({
        label: label.split("-").join("–"),
        count,
        from: Number(label.split("-").at(0)),
        to: Number(label.split("-").at(-1)),
      })),
  }));

export const facetHref = ({ q, facet, label, base }) =>
  base +
  `?q=${
    encodeURIComponent(
      q,
    )
  }&filter-${facet.facet}=${encodeURIComponent(label)}`;

export default function CollectionSearch(
  {
    q,
    lang,
    collection,
    people,
    placeholder,
    facets,
    results,
    list,
    total,
    filters = [],
    noInput = false,
    hero = null,
  }: {
    q?: string;
    people?: string;
    lang?: string;
    collection: string;
    placeholder?: string;
    results: Results<OramaAtom>;
  },
) {
  const query = useSignal(q ?? "");
  const limit = useSignal(10);
  const nextLimit = useSignal(100);
  const etal = useSignal(true);
  const hits = useSignal((results?.hits ?? []) as Result<OramaAtom>[]);
  const count = useSignal(results?.count ?? 0);
  const facet = useSignal(facetMapper(results?.facets));
  const display = useSignal("block");

  //const groupBy = "year";
  const peopleFilter = useSignal(people);
  const maxfacets = 50;

  //facets.year = decadesFacet;

  const where = computed(() => {
    const where = {
      collection,
      people: peopleFilter.value ? peopleFilter.value : undefined,
    };
    for (const [k, v] of filters) {
      if (k === "year") {
        const [from, to] = v.split(/[–:_]{1}/).map(Number);
        if (from >= 1970 && from < 2100) {
          where[k] = !to ? { eq: from } : { between: [from, to] };
        }
      } else {
        where[k] = v;
      }
    }
    return where;
  });

  const performSearch = async (
    _params: { q?: string } = {},
  ) => {
    const q = _params?.q ?? query.value;
    query.value = q;

    const params = {
      q,
      facets,
      ..._params,
      where,
      limit: limit.value,
      //sort: "SORT",
      //groupBy,
    };

    const results = await searchViaApi(params);

    if (results) {
      hits.value = results.hits;
      count.value = results.count;
      facet.value = facetMapper(results?.facets);
    }
  };

  const handleSearchInput = async (e: Event) => {
    const { target: { value, ownerDocument } } = e;
    const { origin, searchParams } = new URL(
      ownerDocument?.URL ?? document?.URL,
    );
    performSearch({ q: value, base: origin, limit: limit.value });
    e.preventDefault();
  };

  const toggleList = (e: Event) => {
    display.value = display.value === "grid" ? "block" : "grid";
    e.preventDefault();
  };

  const increaseLimit = (e: Event) => {
    limit.value = nextLimit.value;
    nextLimit.value += 100;
    performSearch();
    e.preventDefault();
  };

  const base = href({ collection, lang });

  return (
    <main>
      {noInput !== true && (
        <form
          action={``}
          autocomplete="off"
          style={list === "list" ? {} : {
            // display: "grid",
            // gridTemplateColumns: "1fr",
            // gap: "1rem",
            // marginTop: "0.25rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "1rem",
              padding: ".5rem",
              justifyContent: "end",
            }}
          >
            <span></span>
            <label style={{ justifySelf: "end" }}>
              {count.value < total ? `${count} / ${total}` : total}
            </label>
          </div>
          <InputSearch
            autofocus
            name="q"
            placeholder={placeholder}
            label="Søk"
            value={query}
            autocomplete="off"
            onInput={handleSearchInput}
            type="search"
          />

          {/* <label style={{ fontSize: "1rem", display: "" }}>{total}</label> */}
        </form>
      )}

      <output style={{ fontSize: "1rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "0rem",
            justifyContent: "end",
          }}
        >
          <span style={{ fontSize: ".9rem" }}>
            {facet.value.filter((f) => f.facet === "type").map((facet) => (
              <Facets
                facet={facet}
                collection={collection}
                q={query.value}
                lang={lang}
                base={base}
                filter={new Map([...filters])}
              />
            ))}
          </span>
        </div>

        {facet.value.filter((f) => f.facet !== "type").map((facet) => (
          <div>
            <Facets
              facet={facet}
              collection={collection}
              q={query.value}
              lang={lang}
              base={base}
              filter={new Map([...filters])}
            />
          </div>
        ))}

        <div
          style={{
            paddingBlockStart: "0rem",
            display: "grid",
            //gridTemplateColumns: "1fr minmax(150px, 25%)",
          }}
        >
          <SearchResults
            hits={hits.value}
            count={count.value}
            lang={lang}
            display={display.value}
            // group={groupBy}
            etal={etal}
          />

          <div style={{ fontSize: "1rem", paddingBlockStart: "0.5rem" }}>
            {hits.value.length < count.value &&
              (
                <Button
                  disabled={hits.value.length === count.value}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "1rem",
                  }}
                  onClick={increaseLimit}
                >
                  Vis flere treff
                </Button>
              )}

            {hits.value.length && (
              <Button
                style={{
                  backgroundColor: "transparent",
                  fontSize: "1rem",
                }}
                onClick={toggleList}
              >
                Bytt mellom liste og kompakt visning
              </Button>
            )}

            {facet.value.filter((f) =>
              !["collection", "type"].includes(f.facet)
            ).map((
              f,
            ) => (
              f && f.groups.length > 0 && (
                <details
                  open={f.facet !== "type"}
                  style={{ fontSize: "1rem", paddingBlockStart: "1rem" }}
                >
                  <summary>
                    {f.facet === "type"
                      ? (
                        <span>
                          {"type"}
                          {/* {t(`${collection}.type`)} */}
                          <Pill>{count.value}</Pill>
                        </span>
                      )
                      : t("facet." + f.facet)}
                  </summary>

                  <dd style={{ marginInlineStart: 0 }}>
                    {f.groups.slice(0, maxfacets).filter(({ label }) =>
                      !["", "*"].includes(label)
                    ).map(({ label, count }) =>
                      count > 0 && (
                        <span>
                          <a
                            href={href({
                              collection,
                              lang,
                            }) +
                              `?filter-${f.facet}=${encodeURIComponent(label)}`}
                          >
                            {f.facet === "identities"
                              ? cachedNameOf(label)
                              : label}
                          </a>
                          <Pill disabled>{count}</Pill>
                        </span>
                      )
                    )}
                  </dd>
                </details>
              )
            ))}
          </div>
        </div>
      </output>
    </main>
  );
}
