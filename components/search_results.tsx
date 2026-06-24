import { OramaAtomSchema } from "@/search/types.ts";
import { Signal } from "@preact/signals-core";
import { useSignal } from "@preact/signals";
import { SearchResultItem } from "@/components/search_result_item.tsx";

export function SearchResults(
  {
    base,
    hits,
    display,
    collection,
    lang,
    etal = useSignal(true),
    onResultClick,
  }: {
    hits: OramaAtomSchema[];
    display: string;
    lang: string;
    collection: string;
    etal: Signal<boolean>;
    base: string;
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
            key={document.id}
            document={document}
            score={score}
            etal={etal}
            lang={lang}
            collection={collection}
            base={base}
          />
        ))}
      </ol>
    </div>
  );
}
