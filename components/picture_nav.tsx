import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { lang, t } from "akvaplan_fresh/text/mod.ts";
import { AlbumHeader, Article } from "akvaplan_fresh/components/mod.ts";
import { MynewsdeskPanoramaPicture } from "akvaplan_fresh/components/panorama_picture.tsx";
interface Link {
  href: string;
  name?: string;
  text?: string;
}

interface Img {
  id: string;
}

interface PictureNavProps {
  links: Link[];
  img: Img;
  header: string;
  href: string;
}

export const PictureNavArticle = (
  { header, href, links, img }: PictureNavProps,
) => (
  <>
    <div class="pad-1024">
      <AlbumHeader
        text={header}
        href={href}
      />
    </div>

    <Article>
      <nav>
        {img && img?.id ? <MynewsdeskPanoramaPicture id={img.id} /> : null}

        <ol
          style={{ paddingBlockStart: "0rem", paddingBlockEnd: "1.5rem" }}
        >
          {links?.map(({ name, text, href }) => (
            <li
              style={{
                fontSize: "1rem",
                margin: "1px",
                padding: "0.5rem",
                background: "var(--surface2)",
              }}
            >
              <a
                href={href}
                dangerouslySetInnerHTML={{ __html: name ?? text }}
              >
              </a>
              <p style={{ fontSize: "0.75rem" }}>
              </p>
            </li>
          ))}
        </ol>
      </nav>
    </Article>
  </>
);
