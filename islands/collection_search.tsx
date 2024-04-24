import { searchViaApi } from "../search/search_via_api.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";

import { computed, useSignal } from "@preact/signals";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import { href } from "akvaplan_fresh/search/href.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
// import { yearFacet } from "akvaplan_fresh/search/search.ts";
// import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

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
    noInput = false,
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

  const where = computed(() => ({
    collection,
    people: peopleFilter.value ? peopleFilter.value : undefined,
  }));

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

      console.warn(results?.facets);
    }
  };

  const handleSearchInput = async (e: Event) => {
    const { target: { value, ownerDocument } } = e;
    const { origin } = new URL(ownerDocument?.URL ?? document?.URL);
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
          <InputSearch
            autofocus
            name="q"
            placeholder={placeholder}
            label="Søk"
            value={query}
            autocomplete="off"
            onInput={handleSearchInput}
          />

          <label style={{ fontSize: "1rem", display: "none" }}></label>
        </form>
      )}
      <output>
        <div
          style={{
            paddingBlockStart: "1rem",
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
            {facet.value.filter((f) => f.facet !== "collection").map((f) => (
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
                    {f.groups.slice(0, maxfacets).map(({ label, count }) =>
                      count > 0 && (
                        <span>
                          <a
                            href={href({
                              collection,
                              lang,
                            }) +
                              `?q=${
                                encodeURIComponent(
                                  f.facet === "year"
                                    ? label.substring(0, 4)
                                    : label,
                                  //query.value?.length > 0 ? query.value : label,
                                )
                              }&filter-${f.facet}=${encodeURIComponent(label)}`}
                          >
                            {f.facet === "year" ? label.substring(0, 4) : label}
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
