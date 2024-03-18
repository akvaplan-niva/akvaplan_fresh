import { searchMynewsdesk } from "akvaplan_fresh/services/mynewsdesk.ts";
import markdownDocuments from "./documents.json" with { type: "json" };
import { slug as slugify } from "https://deno.land/x/slug@v1.1.0/mod.ts";

const matchIdOrSlug = (
  md: DocumentMeta,
  { id, slug }: { id?: string; slug?: string },
) => id && md.id === id || slug && slugify(md.slug) === slugify(slug);

export interface DocumentMeta {
  [name: string]: string;
}

export const findMarkdownDocument = (
  { id, slug }: { id?: string; slug?: string },
) =>
  markdownDocuments.find(
    (md: DocumentMeta) => matchIdOrSlug(md, { id, slug }),
  );

const toDocument = (d: MynewsdeskItem) => {
  const { document } = d;
  const id = document.split("/").at(-1);
  d.published = new Date(d.published_at.datetime);
  d.title = d?.summary ?? d?.document_name;
  d.thumb = d.document_thumbnail;
  d.id = id;
  return d;
};

export const searchDocuments = async ({ q = "", filter = () => true }) => {
  const _docs = await searchMynewsdeskDocuments({
    q,
  }) ?? [];

  const docs = _docs.filter(filter).map(toDocument);
  return [...markdownDocuments, ...docs];
};

export const searchMynewsdeskDocuments = async (params) => {
  const { items } = await searchMynewsdesk({
    q: "",
    sort: "created",
    limit: 100,
    type_of_media: "documents",
    ...params,
  }) ?? [];

  return items;
};
