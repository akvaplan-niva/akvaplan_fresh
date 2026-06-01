import { asset } from "$fresh/runtime.ts";

const cssfiles = [
  "reset",
  "fonts",
  "openprops",
  "root",
  "dark",
  "light",
  "button",
  "halbum",
  "input-search",
];

const StyleLink = (f: string) => (
  <link rel="stylesheet" href={asset(`/css/${f}.css`)} />
);
export const StylesLegacy = () => (
  <>
    {cssfiles.map(StyleLink)}
  </>
);
