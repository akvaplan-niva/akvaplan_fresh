import { searchViaApi } from "../search/search_via_api.ts";
import { oramaSortPublishedReverse } from "akvaplan_fresh/search/search.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { cachedNameOf } from "akvaplan_fresh/services/akvaplanist.ts";

import { Facets } from "./facets.tsx";

import { InputSearch } from "../components/search/InputSearch.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { computed, Signal, useSignal } from "@preact/signals";
import type { JSX } from "preact";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";
import { SelectSort } from "akvaplan_fresh/components/select_sort.tsx";

export const buildSortBy = (sort: string) => {
  if (sort) {
    const sb = structuredClone(oramaSortPublishedReverse);
    sb.order = sort.startsWith("-") ? "DESC" : "ASC";
    sb.property = sort.replace("-", "");
    return sb;
  }
  return undefined;
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

    limit = 10,
    url,
  }: {
    q?: string;
    people?: string;
    lang?: string;
    collection: string;
    placeholder?: string;
    results: Results<OramaAtom>;
  },
) {
  if (lang) {
    langSignal.value = lang;
  }
  const query = useSignal(q ?? "");
  limit = useSignal(limit);
  const etal = useSignal(true);
  const hits = useSignal((results?.hits ?? []) as Result<OramaAtom>[]);
  const count = useSignal(results?.count ?? 0);
  const nextLimit = useSignal(limit + 100);
  const facet = useSignal(facetMapper(results?.facets));
  const display = useSignal("block");

  //const groupBy = "year";
  const peopleFilter = useSignal(people);
  const maxfacets = 50;

  url = new URL(url);
  const _sort = url.searchParams.has("sort")
    ? url.searchParams.get("sort")
    : "-published";
  const sortSignal: Signal<string | undefined> = useSignal(_sort);
  const urlSignal = useSignal(url.href);

  const sort = computed(() =>
    sortSignal.value?.length && sortSignal.value.length > 0
      ? sortSignal.value
      : undefined
  );

  //facets.year = decadesFacet;

  const where = computed(() => {
    const where = {
      collection,
      people: peopleFilter.value ? peopleFilter.value : undefined,
      year: undefined,
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
    if (query.value?.length === 4 && !("year" in where)) {
      where.year = { elangSignalq: Number(query.value) };
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
      sort: sort.value,
    };

    const results = await searchViaApi(params);

    if (results) {
      hits.value = results.hits;
      count.value = results.count;
      facet.value = facetMapper(results?.facets);
    }
  };

  const handleSearchInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    const { currentTarget } = e;
    if (currentTarget) {
      const { value, ownerDocument } = currentTarget;
      const { origin, searchParams } = new URL(
        ownerDocument?.URL ?? document?.URL,
      );
      performSearch({ q: value, base: origin, limit: limit.value });
      e.preventDefault();
    }
  };

  const toggleList = (e: Event) => {
    display.value = display.value === "grid" ? "block" : "grid";
    e.preventDefault();
  };

  const increaseLimit = (e: Event) => {
    limit.value = nextLimit.value;
    nextLimit.value *= 2;
    performSearch();
    e.preventDefault();
  };

  const setSort = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    e.preventDefault();
    const [option0] = e.currentTarget.selectedOptions;
    const url = urlSignal.value
      ? new URL(urlSignal.value)
      : new URL(e.currentTarget.ownerDocument.URL);

    const sort = option0.value?.length > 0 ? option0.value : undefined;
    if (sort) {
      url.searchParams.set("sort", sort);
    } else {
      url.searchParams.set("sort", "");
    }
    console.warn(url);
    history.replaceState(null, "", url.href);
    sortSignal.value = sort;
    urlSignal.value = url.href;

    performSearch();
  };

  const base = href({ collection, lang });

  return (
    <main>
      {noInput !== true && (
        <form autocomplete="off" method="get" action={urlSignal.value}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              //gap: "1rem",
              padding: ".5rem",
              justifyContent: "end",
            }}
          >
            <label>
              {count.value < total
                ? `${count} treff`
                : `${total} ${t(`collection.${collection}`)}`}
            </label>
            <span
              style={{
                display: "grid",
                alignItems: "center",
                gridTemplateColumns: "1fr auto",
                justifyContent: "end",
                gap: ".25rem",
              }}
            >
              <label>
              </label>

              <SelectSort
                sort={sortSignal.value}
                onChange={setSort}
                lang={lang}
              />
            </span>
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
