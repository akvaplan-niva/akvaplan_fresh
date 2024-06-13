import sd from "npm:showdown";
import sanitize, { type } from "npm:sanitize-html";
import type { Converter, ConverterOptions } from "npm:@types/showdown";
import type { IOptions as SanitizeOptions } from "npm:@types/sanitize-html";

const allowedTags = [
  ...sanitize.defaults.allowedTags,
  "img",
  "details",
  "summary",
].sort();
const sanitizeOptions: SanitizeOptions = { allowedTags };

const style = `p { padding: 0.5 1rem; }
h2 { font-weight: 800; margin: 1rem 0; }
`;
export const Markdown = (
  { text, converterOptions, ...props }: {
    text: string;
    converterOptions: ConverterOptions;
  },
) => {
  const converter: Converter = new sd.Converter(converterOptions);
  const __html = converter.makeHtml(sanitize(text, sanitizeOptions));

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: style,
        }}
      />

      <div
        class="markdown markdown-body"
        style={{ margin: "0 auto", fontFamily: "inherit" }}
        {...props}
        dangerouslySetInnerHTML={{
          __html,
        }}
        {...props}
      />
    </>
  );
};
