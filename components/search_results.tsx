import { OramaAtom } from "akvaplan_fresh/search/types.ts";
import { Signal } from "@preact/signals-core";
import { useSignal } from "@preact/signals";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";

export function SearchResults(
  { hits, display, collection, lang, etal = useSignal(true) }: {
    hits: OramaAtom[];
    display: string;
    lang: string;
    collection: string;
    etal: Signal<boolean>;
  },
) {
  return (
    <div>
      <ol
        style={{
          display,
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        }}
      >
        {hits?.map(({ score, document }) => (
          <SearchResultItem
            document={document}
            score={score}
            etal={etal}
            lang={lang}
            collection={collection}
          />
        ))}
      </ol>
    </div>
  );
}
