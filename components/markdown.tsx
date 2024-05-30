import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";

export const Markdown = ({ text, ...props }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: marky(text),
    }}
    {...props}
  />
);
