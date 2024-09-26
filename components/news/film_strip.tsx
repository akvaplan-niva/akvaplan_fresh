import { MiniNewsCard } from "./mini_news.tsx";
import { HScroll, Icon, MiniCard } from "akvaplan_fresh/components/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { type News } from "akvaplan_fresh/@interfaces/mod.ts";
import { asset, Head } from "$fresh/runtime.ts";

type NewsFilmStripProps = {
  news: News[];
  lang: string;
};

// const cellTower = ({ lang }) => (
//   <div
//     style={{
//       display: "grid",
//       gap: 0,
//       placeContent: "center",
//       gridTemplateColumns: "3.5rem",
//     }}
//   >
//     <a
//       href={lang === "en" ? "news" : "nyheter"}
//     >
//       <Icon name="cell_tower" style={{ fontSize: "3rem" }} />
//     </a>
//   </div>
// );
// staticFirstElement={cellTower({ lang })}

export const MoreNews = ({ href, title, lang }) => (
  <MiniCard>
    <a class="target" href={href} title={title}>
      <NewsIcon />
    </a>
  </MiniCard>
);

const NewsIcon = () => <Icon name="cell_tower" />;
export function NewsFilmStrip(
  { news, lang, BeforeAfter }: NewsFilmStripProps = {},
) {
  const more = t("news.more_news");
  const href = lang === "en" ? "news" : "nyheter";

  return (
    <div>
      {/* <link rel="stylesheet" href={asset("/css/mini-news.css")} /> */}
      <HScroll>
        {BeforeAfter && <BeforeAfter href={href} title={more} />}
        {news.map((
          { title, href, caption, published, thumb, type, hreflang },
        ) => (
          <MiniNewsCard
            img={thumb}
            href={href}
            caption={caption}
            title={title}
            published={published}
            type={type}
            hreflang={hreflang}
            lang={lang}
          />
        ))}
        {BeforeAfter && <BeforeAfter href={href} title={more} />}
      </HScroll>
    </div>
  );
}
