import { searchViaApi } from "akvaplan_fresh/search/search.ts";

import { t } from "akvaplan_fresh/text/mod.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import { useSignal } from "@preact/signals";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import { href } from "akvaplan_fresh/search/href.ts";

const detailsOpen = (collection: string) => true;
// ["image", "document", "video", "blog", "pubs"].includes(collection)
//   ? false
//   : true;

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

export default function GroupedSearch(
  { term, lang, collection, origin }: {
    term?: string;
    lang?: string;
    origin?: string;
    collection?: string;
  },
  { url }: { url: URL },
) {
  const query = useSignal(term);
  const limit = useSignal(5);
  const groups = useSignal([]);
  const facets = useSignal(new Map());
  const sort = useSignal(null);
  const first = useSignal(true);
  const display = useSignal("grid");

  const remoteStatus = useSignal({ status: 0 });

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;

    const results = await searchViaApi({ q, ...params, limit: limit.value });
    const { error } = results;
    if (error?.status > 299) {
      remoteStatus.value = { status: error.status };
    } else {
      remoteStatus.value = { status: 200 };
      groups.value = q?.length > 0 ? results.groups : [];

      for (
        const [collection, count] of Object.entries(
          results?.facets?.collection?.values,
        )
      ) {
        facets.value.set(collection, count);
      }
    }
  };

  const handleUserSearchInput = async (e: Event) => {
    e?.preventDefault();
    const { target: { value, ownerDocument } } = e;

    const base = origin
      ? origin
      : new URL(ownerDocument ? ownerDocument.URL : globalThis.document.URL)
        ?.origin;
    performSearch({ q: value, base: origin, limit: limit.value });
  };

  const toggleList = (e: Event) => {
    display.value = display.value === "grid" ? "block" : "grid";
    e.preventDefault();
  };

  const handleCollectionPressed = async (e: Event) => {
    const {
      target,
    } = e;
    const { selected, value, ownerDocument, dataset: { collection, action } } =
      target;
    const { origin } = new URL(ownerDocument.URL);
    limit.value += 20;
    const q = query.value;
    const where = { collection };
    performSearch({ q, base: origin, limit: limit.value, where });
    e.preventDefault();
  };

  //Handle search via URL query (on first load)
  if (first.value === true && query?.value?.length > 0) {
    first.value = false;
    const q = query.value;
    performSearch({ q, base: origin, where: { collection } });
  }

  const facetCountCollection = (collection: string) =>
    facets.value.get(collection) ?? "?";

  return (
    <main>
      <form
        id="site-search"
        action={`/${lang}/_`}
        autocomplete="off"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
          marginTop: "0.25rem",
        }}
      >
        <InputSearch
          autofocus
          name="q"
          placeholder={t("ui.search.site.Search")}
          label="Søk i Akvaplan-niva (folk, tjenester, forskningstema, prosjekter, nyheter, publikasjoner, dokumenter, media)"
          value={query}
          autocomplete="off"
          onInput={handleUserSearchInput}
        />
      </form>
      <output>
        {remoteStatus.value.status > 299
          ? (
            <p>
              {t("ui.search.Error_search_currently_unavailable")}
            </p>
          )
          : null}
        {groups.value?.map(({ values, result }) => (
          <details
            open={detailsOpen(values?.[0])}
            style={{ paddingBlockStart: "0.5rem" }}
          >
            <CollectionSummary
              q={query.value}
              collection={values?.[0]}
              length={result.length}
              lang={lang}
              count={facetCountCollection(values?.[0])}
            />

            <SearchResults
              hits={result}
              lang={lang}
              display={display.value}
              collection={values?.[0]}
              count={facetCountCollection(values?.[0])}
              q={query}
            />

            <aside
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                placeItems: "center",
                paddingBlockEnd: "0.5rem",
              }}
            >
              {result?.length > 0 &&
                  result.length < facetCountCollection(values?.[0])
                ? (
                  <p style={{ fontSize: "1rem" }}>
                    <Button
                      style={{
                        backgroundColor: "transparent",
                        fontSize: "1rem",
                      }}
                      onClick={handleCollectionPressed}
                      href={`/${lang}/_?q=${query}&collection=${values?.[0]}`}
                    >
                      {t("Vis flere treff")}
                    </Button>
                  </p>
                )
                : null}
            </aside>
          </details>
        ))}
        {query?.value?.length > 0 && remoteStatus.value.status === 200
          ? (
            <Button
              style={{
                backgroundColor: "transparent",
                fontSize: "1rem",
              }}
              onClick={toggleList}
            >
              {display.value === "grid"
                ? "search.ui.ViewResultsAsList"
                : "search.ui.ViewCompactResults"}
            </Button>
          )
          : null}

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
      </output>
    </main>
  );
}
