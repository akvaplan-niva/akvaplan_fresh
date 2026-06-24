import { personURL } from "@/services/nav.ts";
import { t } from "@/text/mod.ts";

import { Akvaplanist, News } from "@/@interfaces/mod.ts";

export const newsFromAkvaplanists =
  ({ lang }) =>
  ({ id, given, family, created, unit, workplace }: Akvaplanist): News => ({
    title: `${given} ${family} ${t("people.employed_in")} ${
      t(`unit.${unit}`)
    }, ${workplace}`,
    href: personURL({ id, given, family }, lang),
    hreflang: lang,
    published: created ?? new Date(),
    type: "person",
  });
