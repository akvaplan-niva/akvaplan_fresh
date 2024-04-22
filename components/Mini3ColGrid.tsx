import { MiniNewsCard } from "akvaplan_fresh/components/mod.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";

export const Mini3ColGrid = (
  { atoms }: { atoms: any[] },
) => (
  <div
    class="news-grid"
    style={{
      marginBlockStart: "0.5rem",
      fontSize: "var(--font-size-fluid-0, 1rem)",
    }}
  >
    {atoms.map(MiniNewsCard)}
  </div>
);
