import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { collectionHref, collectionName } from "akvaplan_fresh/services/nav.ts";

export const CollectionHeader = (
  {
    collection,
    text = collection && collectionName(collection),
    href = collection && collectionHref(collection),
    target,
    icon = "arrow_forward_ios",
  }: {
    collection?: string;
    text?: string;
    href?: string;
    target?: string;
    icon?: string;
  },
) => {
  return (
    <span
      style={{
        marginBlockStart: "0.25rem",
        fontSize: "var(--font-size-4)",
      }}
    >
      {href
        ? <LinkIcon href={href} icon={icon} children={text} right={true} />
        : (
          <span
            style={{
              color: "var(--text1)",
            }}
          >
            {text}
          </span>
        )}
    </span>
  );
};
