import sd from "npm:showdown";
import sanitize from "npm:sanitize-html";
import type { Converter, ConverterOptions } from "npm:@types/showdown";
import type { IOptions as SanitizeOptions } from "npm:@types/sanitize-html";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { Card } from "akvaplan_fresh/components/card.tsx";
import { WideImage } from "akvaplan_fresh/components/wide_image.tsx";
import {
  AkvaplanistCardBasic,
} from "akvaplan_fresh/components/person_card.tsx";
import { SearchHeader } from "akvaplan_fresh/components/search_header.tsx";
import { getAkvaplanist } from "akvaplan_fresh/services/mod.ts";
import { SearchResultItem } from "akvaplan_fresh/components/search_result_item.tsx";
import { SearchResults } from "akvaplan_fresh/components/search_results.tsx";
import { atomizeAkvaplanist } from "akvaplan_fresh/search/indexers/akvaplanists.ts";

const allowedTags = [
  ...sanitize.defaults.allowedTags,
  "img",
  "details",
  "summary",
].sort();
const sanitizeOptions: SanitizeOptions = { allowedTags };

const style = `@layer markdown {
  .markdown { font-size: 1rem; margin: "0 auto"; font-family: inherit; white-space: pre-wrap; }

  .markdown p { padding: 0.5 1rem; }

  .markdown h2 { font-weight: 800; margin: 1rem 0; }
  
  .markdown li { margin-left: 1.5rem; list-style-type: square; }
}`;

const defaultConverterOptions: ConverterOptions = {
  //openLinksInNewWindow: true,
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
        dangerouslySetInnerHTML={{
          __html,
        }}
        {...props}
      />
    </>
  );
};

const peopleIdsAsHits = (ids, lang) =>
  ids.map((id) => {
    const person = getAkvaplanist(id);
    if (person) {
      return { document: atomizeAkvaplanist(person), score: 0 };
    }
  });

export const MarkdownPanel = (
  { panel, editor = false, lang, ...props },
) => {
  const people_ids = panel?.people_ids?.trim()?.split(",") ?? [];

  return (
    <>
      <SearchHeader
        lang={lang}
        title={panel.title}
        subtitle={panel.intro}
        cloudinary={panel?.image?.cloudinary}
      />

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

      <SearchResults hits={peopleIdsAsHits(people_ids, lang)} display="grid" />
    </>
  );
};
