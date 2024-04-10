import { Icon } from "akvaplan_fresh/components/icon.tsx";
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
        ? (
          <a
            href={href}
            style={{ color: "var(--text1)" }}
            target={target}
          >
            {text}{" "}
            <Icon
              name={icon}
              width="1rem"
              height="1rem"
              style={{ color: "var(--accent)" }}
            />
          </a>
        )
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
