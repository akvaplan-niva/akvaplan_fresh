import type { ComponentChildren } from "preact";
const _section = {
  marginTop: "0rem",
  marginBottom: "2rem",
  // padding: "1.5rem",
};
export const Section = (
  { children, ...props }: { children: ComponentChildren },
) => (
  <div {...props}>
    <section style={_section}>{children}</section>
  </div>
);
