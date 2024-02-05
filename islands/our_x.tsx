import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";

import { shuffle } from "akvaplan_fresh/grouping/mod.ts";
import { extractId } from "akvaplan_fresh/services/extract_id.ts";
import { mynewsdeskPanoramaImageUrl } from "akvaplan_fresh/components/panorama_picture.tsx";

import {
  AlbumHeader,
  Article,
  ArticleHeader,
  HScroll,
} from "akvaplan_fresh/components/mod.ts";
import { ScrollImage } from "akvaplan_fresh/islands/HScrollWithDynamicImage.tsx";

import { useSignal } from "@preact/signals";

export const OurX = ({ x, is, header, href }) => {
  const promote = shuffle(x).at(-1);

  promote.panorama = extractId(promote.img)?.length === 20
    ? mynewsdeskPanoramaImageUrl({
      id: extractId(promote.img)!,
      w: 1782,
      ar: "3:1",
    })
    : undefined;

  const main = useSignal(promote);

  const swapImage = (image) => {
    // FIXME OurService:  Do not swap large image on thumbnail hover since images are not of the same size!
    // main.value = image;
  };

  return (
    <div>
      <div class="pad-1024">
        <AlbumHeader
          text={header}
          href={href}
        />
      </div>
      <Article>
        <a
          href={main.value.href}
        >
          <ArticleHeader
            header={main.value.name}
            image={main.value.panorama ?? main.value.img}
          />
          <HScroll>
            {x.map((image) => (
              <ScrollImage
                image={image}
                onHover={() => swapImage(image)}
              />
            ))}
          </HScroll>
        </a>
      </Article>
    </div>
  );
};
