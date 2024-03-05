// Icon component
//
// Run "deno task icons" to fetch icons here into static/icon/*.svg
// Icons are from Google's [Material Symbols](https://developers.google.com/fonts/docs/material_symbols#use_in_web)
import icons from "./icons.json" with { type: "json" };
const svg = new Map(icons);

export const Icon = (
  { name = "", usehref = false, width = 44, height = 44, ...props } = {},
) =>
  usehref
    ? (
      // Referencing icon via <use href="…"/> requires pre-injecting SVG into the current page,
      // eg. using <HiddenIcons />
      <svg class="icon" width={width} height={height} {...props}>
        <use href={`#${name}`} />
      </svg>
    )
    : (
      (
        <svg
          width={width}
          height={height}
          class={`icon ${name}`}
          {...props}
          dangerouslySetInnerHTML={{
            __html: svg.get(name) ?? "",
          }}
        />
      )
    );

export const HiddenIcons = () => (
  <div
    hidden
    dangerouslySetInnerHTML={{ __html: [...svg.values()].join("") }}
  />
);
