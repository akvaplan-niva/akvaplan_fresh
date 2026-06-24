import { t } from "@/text/mod.ts";
import { Pill } from "@/components/button/pill.tsx";

export const CollectionSummary = (
  {
    q,
    collection,
    tprefix = "collection.",
    length,
    count,
    lang,
    handlePressed,
  }: {
    q: string;
    collection: string;
    length: number;
    count: number;
    number: number;
    lang: string;
  },
) => (
  <summary>
    {collection}

    <Pill
      data-collection={collection}
      onClick={handlePressed}
      title={`${length}/${count}`}
    >
      {count}
    </Pill>
  </summary>
);
