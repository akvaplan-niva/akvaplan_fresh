import { searchViaApi } from "akvaplan_fresh/search/search.ts";

import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { InputSearch } from "../components/search/InputSearch.tsx";

import type { SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { Result, Results } from "@orama/orama";

import { useSignal } from "@preact/signals";
import { OramaResults } from "akvaplan_fresh/components/OramaResults.tsx";
import { CollectionSummary } from "../components/CollectionSummary.tsx";
import { yearFacet } from "akvaplan_fresh/search/search.ts";

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
export default function CollectionSearch(
  { q, lang, collection, placeholder, facets, results }: {
    q?: string;
    lang?: string;
    collection: string;
    placeholder?: string;
    results: Results<SearchAtom>;
  },
) {
  const where = { collection };
  const query = useSignal(q);
  const limit = useSignal(5);

  const hits = useSignal((results?.hits ?? []) as Result<SearchAtom>[]);
  const count = useSignal(results?.count ?? 0);

  const oramaResults = useSignal(results);

  const performSearch = async (
    { q, ...params }: { q: string },
  ) => {
    query.value = q;
    const results = await searchViaApi({
      q,
      facets,
      ...params,
      where,
      groupBy: false,
    });
    if (results) {
      hits.value = results.hits;
      count.value = results.count;
      oramaResults.value = results;
    }
  };

  const handleSearchInput = async (e: Event) => {
    const { target: { value, ownerDocument } } = e;
    const { origin } = new URL(ownerDocument?.URL ?? document?.URL);
    performSearch({ q: value, base: origin, limit: limit.value });
    e.preventDefault();
  };

  return (
    <main>
      <form
        id="site-search"
        action={``}
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
          placeholder={placeholder}
          label="Søk i Akvaplan-niva (folk, tjenester, forskningstema, prosjekter, nyheter, publikasjoner, dokumenter, media)"
          value={query}
          autocomplete="off"
          onInput={handleSearchInput}
        />

        <label style={{ fontSize: "1rem", display: "none" }}></label>
      </form>
      <output>
        <div style={{ paddingBlockStart: "1rem" }}>
          <CollectionSummary
            q={query.value}
            collection={collection}
            length={hits.length}
            lang={lang}
            count={count.value}
          />
          <OramaResults hits={hits.value} lang={lang} />
        </div>
      </output>
    </main>
  );
}
