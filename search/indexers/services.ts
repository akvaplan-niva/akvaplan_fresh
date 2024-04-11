import { serviceSummaryMap } from "akvaplan_fresh/services/topic/mod.ts";
import type { OramaAtom } from "akvaplan_fresh/search/types.ts";
import type { CustomerService } from "akvaplan_fresh/@interfaces/customer_service.ts";

import { slug as _slug } from "slug";

export const atomizeCustomerService = (value) => {
  const people: string[] = [];

  const { uuid, topic, en, no, details, tema, detaljer, published }:
    CustomerService = value;

  const desc = serviceSummaryMap.get(topic);

  const atom: OramaAtom = {
    id: uuid,
    slug: `${_slug(no ?? tema)}/${uuid}`,
    collection: "service",
    people: [],
    title: no ?? en,
    text: `${detaljer ?? details} ${desc?.get("no")}`,
    published: published ?? "2023-05-01",
  };
  return atom;
};
