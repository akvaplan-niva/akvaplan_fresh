import { asset } from "$fresh/runtime.ts";

const StyleLink = (f: string) => (
  <link rel="stylesheet" href={asset(`/css/${f}.css`)} />
);
export const LegacyStyles = () => (
  <>
    {[
      "reset",
      "fonts",
      "openprops",
      "root",
      "dark",
      "light",
      "button",
      "input-search",
    ].map(StyleLink)}
  </>
);

export const MorgenStudioStyles = () => (
  <>
    {["colors", "fonts", "typography"].map(StyleLink)}
  </>
);
