import { ComponentChildren } from "preact";

export const Intro = (
  { children }: { children: ComponentChildren },
) => (
  <div class="text-[clamp(1.25rem,1.25vw,2rem)] 2xl:max-w-[55%] text-pretty line-clamp-3">
    {children}
  </div>
);
