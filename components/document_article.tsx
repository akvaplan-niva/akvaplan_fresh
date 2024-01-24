import { Article, Icon } from "akvaplan_fresh/components/mod.ts";
import type { MynewsdeskDocument } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { isodate } from "akvaplan_fresh/time/mod.ts";
import { t } from "akvaplan_fresh/text/mod.ts";

export function DocumentArticle(
  { item }: { item: MynewsdeskDocument },
) {
  return (
    <Article>
      {item && (
        <header>
          <a href={item.document} target="_blank">
            <img
              title={item.header}
              alt={item.header}
              src={String(item.document_thumbnail)}
            />
          </a>
          <h1>
            {item.header}
          </h1>
        </header>
      )}
      <figure>
        {/* <figcaption>{item.photographer}</figcaption> */}
      </figure>
      {JSON.stringify(item)}
      <dl>
        <dt>Published</dt>
        <dd>{isodate(item?.published_at?.datetime)}</dd>
        {
          /* <dt>Dimensions</dt>
    <dd>{item.image_dimensions}</dd>
    <dt>Size (bytes)</dt>
    <dd>{item.image_size}</dd>
    <dt>Original</dt>
    <dd>
      <a download href={item.download_url}>{item.image_name}</a>
    </dd> */
        }
      </dl>

      <div
        style={{
          marginBlockStart: "0.5rem",
          fontSize: "var(--font-size-4)",
        }}
      >
        <Icon
          name={"arrow_back_ios_new"}
          style={{ color: "var(--accent)" }}
          width="1rem"
          height="1rem"
        />{" "}
        <a
          href="/"
          style={{ color: "var(--text1)" }}
        >
          {t("nav.Images")}
          {" "}
        </a>
      </div>
    </Article>
  );
}
