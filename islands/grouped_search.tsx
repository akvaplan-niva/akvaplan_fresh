import { searchViaApi } from "../search/search_via_api.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { useSignal } from "@preact/signals";
import { GroupedSearchCollectionResults } from "akvaplan_fresh/islands/grouped_search_collection_results.tsx";

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
  sort = useSignal(sort);

  display = useSignal(display);
  const remoteStatus = useSignal({ status: 0 });

  if (results?.facets?.collection) {
    for (
      const [collection, count] of Object.entries(
        results?.facets?.collection?.values,
      )
    ) {
      facets.value.set(collection, count);
    }
  }

  const first = useSignal(true); // first

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
      } else {
        remoteStatus.value = { status: 200 };
        groups.value = results.groups;

        for (
          const [collection, count] of Object.entries(
            results?.facets?.collection?.values,
          )
        ) {
          facets.value.set(collection, count);
        }
      }
    }
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

  const handleMoreButtonPressed = async (e: Event) => {
    const {
      target,
    } = e;
    e.preventDefault();
    const { selected, value, ownerDocument, dataset: { collection, action } } =
      target;
    const { origin } = new URL(ownerDocument.URL);
    limit.value += 10;
    const q = query.value;
    const where = { collection };

    performSearch({ q, base: origin, limit: limit.value, where });
  };

  // Handle client side search via URL (on first load)
  if (!results && first.value === true && query?.value?.length > 0) {
    first.value = false;
    const q = query.value;
    performSearch({ q, base: origin, where: { collection } });
  }

  const facetCountCollection = (collection: string) =>
    facets.value.get(collection) ?? "?";

  const SearchControls = ({ collection, query, count, length }) => (
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
              onClick={handleMoreButtonPressed}
              href={`/${lang}/_?q=${query}&collection=${collection}`}
            >
              {t("ui.Load_more")} {t(`collection.${collection}`)}
            </Button>
          </p>
        )}

      {false
        ? (
          <Button
            style={{
              backgroundColor: "transparent",
              fontSize: "1rem",
            }}
            _onClick={"changeSort"}
          >
            relevans-score
          </Button>
        )
        : null}
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
            gap: "1rem",
            marginTop: "0.25rem",
          }}
        >
          <InputSearch
            autofocus={autofocus}
            name="q"
            placeholder={t("ui.search.site.Search")}
            label="Søk i Akvaplan-niva (folk, tjenester, forskningstema, prosjekter, nyheter, publikasjoner, dokumenter, media)"
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
              >
                <SearchControls
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
