import { serviceSummaryMap } from "akvaplan_fresh/services/topic/mod.ts";

import { slug as _slug } from "slug";
import { render } from "preact-render-to-string";

import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { CustomerService } from "akvaplan_fresh/@interfaces/customer_service.ts";
import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";

export const atomizeCustomerService = async (value) => {
  const {
    uuid,
    topic,
    en,
    no,
    details,
    tema,
    detaljer,
    searchwords,
    published,
    img512,
    contact,
  }: CustomerService = value;

  const person = await getAkvaplanist(contact);

  const people: string[] = person ? [`${person.given} ${person.family}`] : [];

  const desc = serviceSummaryMap.get(topic);

  const text = `${detaljer ?? details}`;

  const id = `${uuid}`;

  const atom: OramaAtom = {
    id,
    //slug: `${_slug(no ?? tema)}/${uuid}`,
    collection: "service",
    people,
    people_ids: [contact],
    //title: no ?? en,
    text,
    published: published ?? "2023-05-01",
    img512,
    searchwords,
    intl: {
      name: { en, no },
      desc: { en: render(desc?.get("en")), no: render(desc?.get("no")) },
    },
  };

  return atom;
};
