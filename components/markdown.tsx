import sd from "npm:showdown";
import sanitize from "npm:sanitize-html";
import type { Converter, ConverterOptions } from "npm:@types/showdown";
import type { IOptions as SanitizeOptions } from "npm:@types/sanitize-html";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";

const allowedTags = [
  ...sanitize.defaults.allowedTags,
  "img",
  "details",
  "summary",
].sort();
const sanitizeOptions: SanitizeOptions = { allowedTags };

const style = `@layer markdown {


  .markdown p { padding: 0.5 1rem; }
  .markdown h2 { font-weight: 800; margin: 1rem 0; }
  .markdown li {
    margin-left: 1.5rem;
    list-style-type: square;
  }
}



`;

const defaultConverterOptions: ConverterOptions = {
  openLinksInNewWindow: true,
};

export const Markdown = (
  { text, converterOptions = defaultConverterOptions, ...props }: {
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
        class="markdown"
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

export const MarkdownPanel = (
  { panel, editor = false, lang, ...props },
) => {
  return (
    <>
      {panel?.intro && (
        <Section>
          <Card>
            <p id="intro">
              <Markdown
                text={panel.intro}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </p>

            <WideImage
              style={{ background: "var(--light)", maxWidth: "10vh" }}
              {...panel?.image}
              lang={lang}
              editor={editor}
            />
          </Card>
        </Section>
      )}

      <Section>
        <Card>
          <p>
            {panel?.desc && (
              <Markdown
                text={panel.desc}
                style={{ whiteSpace: "pre-wrap", fontSize: "1rem" }}
              />
            )}
          </p>
        </Card>
      </Section>
    </>
  );
};
