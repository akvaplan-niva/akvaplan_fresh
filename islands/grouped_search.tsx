import { searchViaApi } from "../search/search_via_api.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { useSignal } from "@preact/signals";
import { GroupedSearchCollectionResults } from "akvaplan_fresh/islands/grouped_search_collection_results.tsx";
import { SelectSort } from "akvaplan_fresh/components/select_sort.tsx";
import { JSX } from "preact/jsx-runtime";
import { Result } from "https://esm.sh/v135/maplibre-gl@4.4.1/dist/maplibre-gl.js";
import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { SearchViewButtons } from "akvaplan_fresh/islands/search_view_buttons.tsx";

const collectionHref = ({ collection, lang }) => {
  if (!intlRouteMap(lang).has(collection)) {
    console.error("Missing collectionHref", collection, lang);
  }
  return intlRouteMap(lang).get(collection);
};

const CollectionSummary = (
  { q, collection, length, count, lang, handlePressed }: {
    q: string;
    collection: string;
    length: number;
    count: number;
    number: number;
    lang: string;
  },
) => (
  <summary>
    {t(`collection.${collection}`)}

    <Pill
      data-collection={collection}
      onClick={handlePressed}
    >
      {count}
    </Pill>
  </summary>
);

const isOpen = (collection: string) =>
  ["image"].includes(collection) ? false : true;

export default function GroupedSearch(
  {
    term,
    lang,
    collection,
    by,
    origin,
    limit = 5,
    threshold,
    display = "grid",
    exclude = [],
    results,
    sort,
    //first = true, // changed, don't allow sending first
    noInput = false,
    exact = false,
    action = `/${lang}/search`,
    autofocus = true,
    //url,
  }: {
    term?: string;
    lang?: string;
    origin?: string;
    collection?: string[] | string;
    sort?: string;
    limit?: number;
    threshold?: number;
    exact?: boolean;
  },
  { url }: { url: URL },
) {
  const query = useSignal(term);
  limit = useSignal(limit);
  const groups = useSignal(results ? results.groups : []);
  const facets = useSignal(new Map());

  display = useSignal(display);
  const remoteStatus = useSignal({ status: 0 });

  const key = by ? by : "collection";
  const first = useSignal(true); // first

  const hits = useSignal((results?.hits ?? []) as Result<OramaAtom>[]);
  const count = useSignal(results?.count ?? 0);
  sort = useSignal(sort);

  const setFacetCounts = (results) => {
    if (results?.facets?.[key]) {
      for (
        const [facet, count] of Object.entries(
          results?.facets?.[key]?.values,
        )
      ) {
        facets.value.set(facet, count);
      }
      first.value = false;
    }
  };

  if (results) {
    setFacetCounts(results);
  }

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;

    if (q === "" && first.value === false) {
      // Clear results and don't perform a search if the input field is cleared
      groups.value = [];
    } else {
      params.exact = params.exact ?? exact;
      params.sort = params.sort ?? sort.value;
      params.threshold = threshold ?? undefined;
      params.where = collection ? { collection } : undefined;

      const results = await searchViaApi({ q, ...params, limit: limit.value });

      const { error } = results;
      if (error?.status > 299) {
        remoteStatus.value = { status: error.status };
      } else if (results) {
        remoteStatus.value = { status: 200 };
        groups.value = results.groups;
        count.value = results.count;
        hits.value = results.hits;
        setFacetCounts(results);
      }
    }
  };
  const setSort = (e: JSX.TargetedEvent<HTMLSelectElement, Event>) => {
    e.preventDefault();
    const [option0] = e.currentTarget.selectedOptions;
    const sorton = option0.value?.length > 0 ? option0.value : "";
    sort.value = sorton;
    performSearch({ q: query.value ?? "" });
  };

  const handleUserSearchInput = async (e: Event) => {
    const { target: { value, ownerDocument } } = e;

    const base = origin
      ? origin
      : new URL(ownerDocument ? ownerDocument.URL : globalThis.document.URL)
        ?.origin;

    performSearch({ q: value, base: origin, limit: limit.value });
    e?.preventDefault();
  };

  const increaseLimit = (e: Event) => {
    e.preventDefault();
    const max = 100;
    const next = limit.value * 2;
    if (limit.value < max) {
      limit.value = next > max ? max : next;
      performSearch({ q: query.value });
    }
  };

  const toggleListDisplay = (e: Event) => {
    e.preventDefault();
    display.value = display.value === "grid" ? "block" : "grid";
  };

  const decreaseLimit = (e: Event) => {
    e.preventDefault();
    const min = 5;
    const next = limit.value / 2;
    if (limit.value > min) {
      limit.value = next < min ? min : next;
      performSearch({ q: query.value });
    }
  };

  // Handle client side search via URL (on first load)
  if (first.value === true && query?.value?.length > 0) {
    first.value = false;
    const q = query.value;
    performSearch({ q, base: origin, where: { collection } });
  }

  const facetCountCollection = (collection: string) =>
    facets.value.get(collection) ?? "?";

  const LoadMoreButton = ({ collection, query, count, length }) => (
    <aside
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        placeItems: "center",
        paddingBlockEnd: "0.5rem",
      }}
    >
      {length > 0 && length < count &&
        (
          <p style={{ fontSize: "1rem" }}>
            <Button
              style={{
                backgroundColor: "transparent",
                fontSize: "0.75rem",
              }}
              onClick={increaseLimit}
              href={`/${lang}/_?q=${query}&collection=${collection}`}
            >
              {t("ui.Load_more")} {t(`collection.${collection}`)}
            </Button>
          </p>
        )}
    </aside>
  );

  return (
    <main>
      {noInput !== true && (
        <form
          id="site-search"
          action={action}
          autocomplete="off"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            marginTop: "0.25rem",
          }}
        >
          {String(query) === "" ? null : (
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
                <span>
                  {count} {t("search.hits")}{" "}
                  {Number(count) === 0 ? null : (
                    <span class="hide-s">
                      ({t("search.viewing_up_to")} {limit})
                    </span>
                  )}
                </span>
              </label>
              <span>
                <SearchViewButtons
                  {...{
                    display,
                    toggleListDisplay,
                    increaseLimit,
                    decreaseLimit,
                    min: 5,
                    max: 100,
                    limit,
                  }}
                />
              </span>

              <span style={{ textAlign: "center" }}>
                <label>
                  <span class="hide-s">{t("sort.label")}:</span>
                  <SelectSort
                    sort={sort}
                    options={["", "-published", "published"]}
                    onChange={setSort}
                    lang={lang}
                    style={{ fontSize: ".8rem", display: "inline-flex" }}
                  />
                </label>
              </span>
            </div>
          )}

          <InputSearch
            autofocus={autofocus}
            name="q"
            placeholder={t("ui.search.site.Search")}
            label="Søk i Akvaplan-niva (folk, tjenester, forskning, prosjekter, nyheter, publikasjoner, dokumenter, media)"
            value={query}
            autocomplete="off"
            onInput={handleUserSearchInput}
          />
        </form>
      )}
      <output>
        {remoteStatus.value.status > 299
          ? (
            <p>
              {/* {t("ui.search.Error_search_currently_unavailable")} */}
            </p>
          )
          : null}

        {groups.value?.map((
          { values, result },
        ) => (!exclude.includes(values?.[0])
          ? (
            <>
              <GroupedSearchCollectionResults
                query={query}
                hits={result}
                collection={values?.[0]}
                count={facetCountCollection(values?.[0])}
                display={display}
                open={isOpen(values?.[0])}
                by={by}
              >
                <LoadMoreButton
                  query={query}
                  length={result.length}
                  collection={values?.[0]}
                  count={facetCountCollection(values?.[0])}
                />
              </GroupedSearchCollectionResults>
            </>
          )
          : null)
        )}
        {false ?? query?.value?.length > 0
          ? (
            <Button
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
              }}
              onClick={() =>
                display.value = display.value === "grid" ? "block" : "grid"}
            >
              {display.value === "grid"
                ? "search.ui.ViewResultsAsList"
                : "search.ui.ViewCompactResults"}
            </Button>
          )
          : null}
      </output>
    </main>
  );
}
