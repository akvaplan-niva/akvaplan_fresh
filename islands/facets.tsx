import { Pill } from "akvaplan_fresh/components/button/pill.tsx";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";
import { facetHref } from "akvaplan_fresh/islands/collection_search.tsx";
import {
  cachedNameOf,
  identities,
} from "akvaplan_fresh/services/akvaplanist.ts";
import {} from "akvaplan_fresh/services/mod.ts";

const buildIntlFacetLabel = (label, facet) => {
  if ("identities" === facet.facet) {
    return identities.has(label) ? cachedNameOf(label) : label;
  } else {
    return t(facet.facet + "." + label);
  }
};

export const Facets = ({ q, facet, max = 6, lang, base, filter }) => (
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
