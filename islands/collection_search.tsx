import { searchViaApi } from "../search/search_via_api.ts";

import { href } from "akvaplan_fresh/search/href.ts";
import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { cachedNameOf } from "akvaplan_fresh/services/akvaplanist.ts";

import { Facets } from "./facets.tsx";

import { InputSearch } from "../components/search/InputSearch.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { computed, Signal, useSignal } from "@preact/signals";
import type { JSX } from "preact";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";
import { SelectSort } from "akvaplan_fresh/components/select_sort.tsx";
import IconButton from "akvaplan_fresh/components/button/icon_button.tsx";
import { SearchViewButtons } from "./search_view_buttons.tsx";

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

const setSearchParamOrDeleteOnBlank = (
  param: string,
  value: string,
  url: URL,
) => {
  switch (value) {
    case undefined:
    case null:
    case "":
      return url.searchParams.delete(param);
    default:
      return url.searchParams.set(param, value);
  }
};

export function CollectionSearch(
  {
    q,
    lang,
    collection,
    people,
    placeholder,
    facets,
    results,
    list = "block",
    total,
    filters = [],
    noInput = false,
    hero = null,
    sortOptions,
    limit = 25,
    url,
    sort,
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
  const facet = useSignal(facetMapper(results?.facets));
  const display = useSignal(list);

  url = new URL(url);
  const _sort = url.searchParams.has("sort")
    ? url.searchParams.get("sort")
    : sort ?? "-published";

  const sortSignal: Signal<string | undefined> = useSignal(_sort);
  const urlSignal = useSignal(url.href);
  const where = computed(() => {
    const where = {
      collection,
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
    if (
      undefined === where.year && query.value?.length === 4 &&
      Number(query.value) > 1900
    ) {
      where.year = { eq: Number(query.value) };
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
      sort: sortSignal.value ?? "",
    };

    const url = urlSignal.value ? new URL(urlSignal.value) : undefined;
    if (url) {
      setSearchParamOrDeleteOnBlank("q", params.q, url);
      setSearchParamOrDeleteOnBlank("sort", params.sort, url);
      history.replaceState(null, "", url);
      urlSignal.value = url.href;
    }

    const results = await searchViaApi(params);

    if (results) {
      hits.value = results.hits;
      count.value = results.count;
      facet.value = facetMapper(results?.facets);
    }
  };

  const handleSearchInput = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
    e.preventDefault();
    const { currentTarget } = e;
    if (currentTarget) {
      const { value, ownerDocument } = currentTarget;
      const { origin } = new URL(
        ownerDocument?.URL ?? globalThis?.document?.URL,
      );
      performSearch({ q: value, base: origin, limit: limit.value });
    }
  };

  const toggleListDisplay = (e: Event) => {
    e.preventDefault();
    display.value = display.value === "grid" ? "block" : "grid";
  };

  const decreaseLimit = (e: Event) => {
    e.preventDefault();
    const min = 25;
    const next = limit.value / 2;
    if (limit.value > min) {
      limit.value = next < min ? min : next;
      performSearch();
    }
  };

  const increaseLimit = (e: Event) => {
    e.preventDefault();
    const max = 1000;
    const next = limit.value * 2;
    if (limit.value < max) {
      limit.value = next > max ? max : next;
      performSearch();
    }
  };

  const setSort = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    e.preventDefault();
    const [option0] = e.currentTarget.selectedOptions;
    const sort = option0.value?.length > 0 ? option0.value : undefined;
    sortSignal.value = sort;
    performSearch();
  };

  const base = href({ collection, lang });

  return (
    <main>
      {noInput !== true && (
        <form autocomplete="off" method="get" action={urlSignal}>
          <div
            style={{
              display: "grid",
              alignItems: "center",
              gridTemplateColumns: "1fr 1fr auto",
              justifyContent: "end",
              gap: ".25rem",
            }}
          >
            <label>
              {count} {t("search.hits")} {Number(count) > 0
                ? (
                  <span>
                    ({t("search.viewing")} {hits.value.length === Number(count)
                      ? t("search.all")
                      : hits.value.length})
                  </span>
                )
                : <a href="">{t("search.restart")}</a>}
            </label>
            <span>
              <SearchViewButtons
                {...{
                  limit,
                  display,
                  toggleListDisplay,
                  increaseLimit,
                  decreaseLimit,
                }}
              />
            </span>

            <span style={{ textAlign: "center" }}>
              <label>
              </label>
              <label>
                {t("sort.label")}:
                <SelectSort
                  sort={sortSignal.value}
                  options={sortOptions}
                  onChange={setSort}
                  lang={lang}
                  style={{ fontSize: ".8rem", display: "inline-flex" }}
                />
              </label>
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
        {Object.keys(facets ?? {}).length > 0
          ? (
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
          )
          : null}

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
                    {f.groups.filter(({ label }) => !["", "*"].includes(label))
                      .map(({ label, count }) =>
                        count > 0 && (
                          <span>
                            <a
                              href={href({
                                collection,
                                lang,
                              }) +
                                `?filter-${f.facet}=${
                                  encodeURIComponent(label)
                                }`}
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

export default CollectionSearch;
