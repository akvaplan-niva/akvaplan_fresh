import type { ComponentChildren } from "preact";

export const H1 = ({ children }: { children: ComponentChildren }) => (
  <h1 class="h1 text text-balance">{children}</h1>
);

export const H2 = ({ children }: { children: ComponentChildren }) => (
  <h2 class="h2 text-pretty">{children}</h2>
);

export const H3 = ({ children }: { children: ComponentChildren }) => (
  <h3 class="h3">{children}</h3>
);
