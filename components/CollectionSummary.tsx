import { t } from "akvaplan_fresh/text/mod.ts";
import { Pill } from "akvaplan_fresh/components/button/pill.tsx";

export const CollectionSummary = (
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
