import type { ComponentChildren } from "preact";

// When component is used inside an islandsDeno namespaced server side code leaks
// import { svgMapFromStaticDir } from "akvaplan_fresh/utils/materialsymbols/mod.ts";
// const svgs = await svgMapFromStaticDir();

import icons from "./icons.json" with { type: "json" };
const svgs = new Map(icons as [string, string][]);

const wrapperStyle = {
  display: "inline grid",
  gap: ".5rem",
  gridTemplateColumns: "auto auto",
  alignItems: "center",
  justifyItems: "center",
  width: "fit-content",
  padding: ".2rem .4rem",
  backgroundColor: "var(--surface0)",
  borderRadius: ".2rem",
  margin: "0.1rem",
};

export const Icon2 = (
  { href, name, size = "1em", style, children, ...props }: {
    href: string;
    icon: string;
    children: ComponentChildren;
  },
) => (
  <span
    role="presentation"
    aria-label={name}
    href={href}
    style={{
      display: "inline grid",
      gridTemplateColumns: "auto",
      alignItems: "center",
      justifyItems: "center",
      fill: "currentColor",
      width: size,
      height: size,
      ...style,
    }}
    dangerouslySetInnerHTML={{
      __html: svgs.get(name) ?? "",
    }}
  />
);

export const LinkIcon = (
  { href, icon, right = false, style, children, ...props }: {
    href: string;
    icon: string;
    right?: boolean;
    style?: any;
    children?: ComponentChildren;
  },
) => (
  <a
    href={href}
    style={{
      ...wrapperStyle,
      ...style,
    }}
    {...props}
  >
    {right !== true && <Icon2 name={icon} style={{ color: "var(--accent)" }} />}
    {children && (
      <span style={{ color: "var(--text1)" }}>
        {children}
      </span>
    )}
    {right === true && <Icon2 name={icon} style={{ color: "var(--accent)" }} />}
  </a>
);

export const TextIcon = (
  { href, icon, style, right = false, children, ...props }: {
    href: string;
    icon: string;
    style: any;
    children: ComponentChildren;
  },
) => (
  <span
    style={{
      ...wrapperStyle,
      ...style,
    }}
    {...props}
  >
    <Icon2 name={icon} style={{ color: "var(--accent)" }} />
    {children && (
      <span style={{ color: "var(--text1)" }}>
        {children}
      </span>
    )}
  </span>
);
