import { CollectionHeader } from "akvaplan_fresh/components/album/album_header.tsx";

export const LinkBanner = ({ href, text }) => (
  <aside
    style={{
      background: "var(--surface0)",
      "border-radius": "5px",
      padding: "0.5rem",
    }}
  >
    <CollectionHeader
      text={text}
      href={href}
      target="_blank"
    />
  </aside>
);
