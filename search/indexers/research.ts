import type { SearchAtom } from "akvaplan_fresh/search/types.ts";

import { slug, slug as _slug } from "slug";
import { nameOfId } from "akvaplan_fresh/services/akvaplanist.ts";
import { id0 } from "akvaplan_fresh/services/mynewsdesk.ts";

export const atomizeResearchTopic = async (research) => {
  const { uuid, en, no, contact_id, searchwords } = research;
  const people = [await nameOfId(contact_id)];
  const published = research?.published ?? "2023-05-01";
  const year = new Date(published).getFullYear();
  //const slug = `${_slug(name)}/${uuid}`,
  const atom: SearchAtom = {
    slug: uuid,
    collection: "research",
    type: "research",
    people,
    authors: [],
    //title: name,
    text: `${JSON.stringify(searchwords)}`,
    searchwords,
    published,
    year,
  };
  const NO = { ...atom, title: no, lang: "no", id: `${uuid}/no` };
  const EN = { ...atom, title: en, lang: "en", id: `${uuid}/en` };

  return [NO, EN];
};
