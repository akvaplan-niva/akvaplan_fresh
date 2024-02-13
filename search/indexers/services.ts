import { serviceSummaryMap } from "akvaplan_fresh/services/topic/mod.ts";
import type { OramaAtom, SearchAtom } from "akvaplan_fresh/search/types.ts";
import type { CustomerService } from "akvaplan_fresh/@interfaces/customer_service.ts";

import { slug as _slug } from "slug";
import { insert } from "@orama/orama";

export const insertCustomerServices = async (
  orama: OramaAtom,
  list: Deno.KvListIterator<CustomerService>,
) => {
  for await (
    const { value } of list
  ) {
    const people: string[] = [];

    const { uuid, topic, en, no, details, tema, detaljer, published }:
      CustomerService = value;

    const desc = serviceSummaryMap.get(topic);

    const atomEn: SearchAtom = {
      id: "svc/en/" + uuid,
      lang: "en",
      hreflang: "en",
      slug: `${_slug(en ?? topic)}/${uuid}`,
      collection: "service",
      people: [],
      title: en ?? no,
      text: `${details ?? detaljer} ${desc?.get("en")}`,
      published: published ?? "2023-05-01",
    };

    const atomNo: SearchAtom = {
      id: "svc/no/" + uuid,
      lang: "no",
      hreflang: "no",
      slug: `${_slug(no ?? tema)}/${uuid}`,
      collection: "service",
      people: [],
      title: no ?? en,
      text: `${detaljer ?? details} ${desc?.get("no")}`,
      published: published ?? "2023-05-01",
    };

    await insert(orama, atomEn);
    await insert(orama, atomNo);
  }
};
