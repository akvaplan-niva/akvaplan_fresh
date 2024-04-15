import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import {
  extractLangFromUrl,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import Button from "akvaplan_fresh/components/button/button.tsx";

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
) => {
  if (!globalThis.Deno) {
    const lang = extractLangFromUrl(document.URL);
    langSignal.value = lang;
  }

  return (
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
};

// const toggleList = (e: Event) => {
//   display.value = display.value === "grid" ? "block" : "grid";
//   e.preventDefault();
// };
export const GroupedSearchCollectionResults = ({
  open = true,
  count,
  collection,
  hits,
  query,
  lang,
  display,
  noDetails,
}) => (
  <details
    open={open}
    style={{ paddingBlockStart: "0.5rem" }}
  >
    <CollectionSummary
      q={query.value}
      collection={collection}
      length={hits?.length}
      lang={lang}
      count={count}
    />

    <SearchResults
      hits={hits}
      lang={lang}
      display={display.value}
      count={count}
      q={query}
    />
  </details>
);
