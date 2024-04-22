import type { ComponentChildren } from "preact";
const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
  // padding: "1.5rem",
};
export const PageSection = (
  { children, ...props }: { children: ComponentChildren },
) => (
  <div {...props}>
    <section style={_section}>{children}</section>
  </div>
);
