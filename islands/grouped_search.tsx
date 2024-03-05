import { searchViaApi } from "akvaplan_fresh/search/search.ts";

import { lang as langSignal, t } from "akvaplan_fresh/text/mod.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { GroupByParams, Orama, Results, SearchParams } from "@orama/orama";

import { useSignal } from "@preact/signals";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";

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
  const first = useSignal(true);
  const sitelang = langSignal.value;

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;

    const results = await searchViaApi({ q, ...params });
    if (results) {
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

        <label style={{ fontSize: "1rem", display: "none" }}></label>
      </form>
      <output>
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
              handlePressed={handleCollectionPressed}
              count={facetCountCollection(values?.[0])}
            />

            <SearchResults hits={result} lang={lang} />
          </details>
        ))}
      </output>
    </main>
  );
}
