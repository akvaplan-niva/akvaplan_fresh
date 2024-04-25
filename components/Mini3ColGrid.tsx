import { MiniNewsCard } from "akvaplan_fresh/components/mod.ts";

export const Mini3ColGrid = (
  { atoms }: { atoms: any[] },
) => (
  <div
    class="mini-news-3col"
    style={{
      marginBlockStart: "0.5rem",
      fontSize: ".75rem",
    }}
  >
    {atoms?.map(MiniNewsCard)}
  </div>
);

export const Mini4ColGrid = (
  { atoms }: { atoms: any[] },
) => (
  <div
    class="mini-news-4col"
    style={{
      marginBlockStart: ".5rem",
      fontSize: ".75rem",
    }}
  >
    {atoms?.map(MiniNewsCard)}
  </div>
);
