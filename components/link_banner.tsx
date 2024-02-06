import { AlbumHeader } from "akvaplan_fresh/components/album/album_header.tsx";

export const LinkBanner = ({ href, text }) => (
  <aside
    style={{
      background: "var(--surface0)",
      "border-radius": "5px",
      padding: "0.5rem",
    }}
  >
    <AlbumHeader
      text={text}
      href={href}
      target="_blank"
    />
  </aside>
);
