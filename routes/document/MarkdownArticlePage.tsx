import { AltLangInfo, Article, Page } from "akvaplan_fresh/components/mod.ts";
import { marky } from "https://deno.land/x/marky@v1.1.7/mod.ts";
import { findMarkdownDocument } from "akvaplan_fresh/services/documents.ts";
import { documentHref } from "akvaplan_fresh/services/nav.ts";

export const MarkdownArticlePage = (
  { text, meta, lang }: { text: string; lang: string; meta: DocumentMeta },
) => {
  // Find alternate lang version (if markdown language (`meta.lang`) differs from present site `lang`)
  const alt = meta.lang !== lang && meta.alt &&
    findMarkdownDocument({ id: meta.alt });

  const alternate = alt && {
    ...alt,
    href: documentHref({
      id: alt.id,
      lang: alt.lang,
      title: alt.title,
    }),
  };

  const style = `h2 {
    margin-top: 1.5rem;
    margin-bottom: 0.2rem;
  }
  p {
    margin-top: 1rem;
    margin-bottom: 0.2rem;
  }`;
  return (
    <Page>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <Article>
        {alt && (
          <AltLangInfo
            alternate={alternate}
            lang={lang}
            language={meta.lang}
          />
        )}
        <div
          style={{ maxWidth: "1440px" }}
          dangerouslySetInnerHTML={{ __html: marky(text) }}
        />
      </Article>
    </Page>
  );
};
