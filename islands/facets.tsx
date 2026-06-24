import { Pill } from "@/components/button/pill.tsx";
import { LinkIcon } from "@/components/icon_link.tsx";
import { t } from "@/text/mod.ts";
import { facetHref } from "./collection_search.tsx";
import { cachedNameOf, identities } from "@/services/akvaplanist.ts";
import {} from "@/services/mod.ts";

const buildIntlFacetLabel = (label, facet) => {
  if ("identities" === facet.facet) {
    return identities.has(label) ? cachedNameOf(label) : label;
  } else {
    const key = facet.facet + "." + label;
    return t(key);
  }
};

export const Facets = ({ q, facet, max, lang, base, filter }) => (
  <>
    {facet.groups.slice(0, max).map(({ label, count }) => (
      <>
        {filter.has(facet.facet)
          ? (
            <LinkIcon
              icon={"close"}
              href={base}
            >
              {t(facet.facet + "." + label)}
              <Pill>
                {count}
              </Pill>
            </LinkIcon>
          )
          : (
            <LinkIcon
              href={facetHref({ q, facet, label, base })}
            >
              {buildIntlFacetLabel(label, facet)}
              <Pill
                style={{ border: ".1rem", padding: ".2rem", margin: ".1rem" }}
              >
                {count}
              </Pill>
            </LinkIcon>
          )}
      </>
    ))}
  </>
);
