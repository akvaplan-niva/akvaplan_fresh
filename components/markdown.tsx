import sd from "showdown";
import sanitize from "sanitize-html";
import type { Converter, ConverterOptions } from "npm:@types/showdown";
import type { IOptions as SanitizeOptions } from "npm:@types/sanitize-html";
import { Section } from "@/components/section.tsx";
import { Card } from "@/components/card.tsx";
import { WideImage } from "@/components/wide_image.tsx";
import { SearchHeader } from "@/components/search_header.tsx";
import { getAkvaplanist } from "@/services/mod.ts";
import { SearchResultItem } from "@/components/search_result_item.tsx";
import { SearchResults } from "@/components/search_results.tsx";
import { atomizeAkvaplanist } from "@/search/indexers/akvaplanists.ts";
import { ImgHero } from "@/components/hero/hero.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { MorgenStudioStyles } from "@/components/styles.tsx";
import { Head } from "$fresh/runtime.ts";
import { Breadcrumbs } from "@/components/site_nav.tsx";
import { Eyebrow } from "@/components/eyebrow.tsx";
import { PersonCard } from "@/components/person_card.tsx";

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

  .markdown h2 { font-weight: 800; margin: .75rem 0; }

  .markdown h3 { font-weight: 800; margin: .75rem 0; }

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

export const peopleIdsAsHits = (ids, lang) =>
  ids.filter((id) => id?.length === 3).map((id) => {
    const person = getAkvaplanist(id);
    if (person) {
      return { document: atomizeAkvaplanist(person), score: 0 };
    }
  });

export const MarkdownPanel = (
  { eyebrow, panel, breadcrumbs, lang, ...props },
) => {
  const people_ids = panel?.people_ids?.trim()?.split(",") ?? [];

  //FIXME
  //<Breadcrumbs list={breadcrumbs} />

  return (
    <>
      <Head>
        <MorgenStudioStyles />
      </Head>
      {
        /* <SearchHeader
        lang={lang}
        title={panel.title}
        subtitle={panel.intro}
        cloudinary={panel?.image?.cloudinary}
      /> */
      }

      <ImgHero
        headline={panel.title}
        cloudinary={panel.image.cloudinary}
        intro={panel.intro}
        eyebrow={eyebrow}
      />

      <div class="grid lg:grid-cols-[7fr_4fr]">
        <article class="article-content text-lg p-3 lg:px-24">
          {panel?.desc && (
            <Markdown
              text={panel.desc}
              style={{
                fontSize: "calc(1.25rem + 0.1vw)",
                //lineHeight: 1.5,
                //whiteSpace: "pre-wrap",
                maxWidth: "1000px",
                overflow: "hidden",
              }}
            />
          )}
        </article>
        <div>
          {people_ids?.length > 0 &&
            people_ids?.map((id: string) => (
              <PersonCard
                id={id}
                icons={false}
              />
            ))}
        </div>
      </div>
    </>
  );
};
