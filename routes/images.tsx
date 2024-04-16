import { lang, t } from "akvaplan_fresh/text/mod.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { type InternationalProps } from "akvaplan_fresh/utils/page/international_page.ts";

interface ImagesProps extends InternationalProps {
  images: MynewsdeskItem[];
  href: string;
}

import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";

import { asset, Head } from "$fresh/runtime.ts";
import { searchImageAtoms } from "akvaplan_fresh/services/mynewsdesk.ts";
import { buildImageMapper } from "akvaplan_fresh/services/cloudinary.ts";
import type { MynewsdeskImage } from "akvaplan_fresh/@interfaces/mynewsdesk.ts";
import { href } from "akvaplan_fresh/search/href.ts";
import CollectionSearch from "akvaplan_fresh/islands/collection_search.tsx";
import { collectionHref } from "akvaplan_fresh/services/mod.ts";
import { AImg } from "../components/AImg.tsx";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(images|image|bilder|bilde)",
};
export interface Img {
  src: string;
}

export const handler: Handlers<ImagesProps> = {
  async GET(_req: Request, ctx: FreshContext) {
    const { params } = ctx;
    lang.value = params.lang;
    const base = `/${params.lang}/${params.page}/`;
    const title = t("nav.Images");

    const images = (await searchImageAtoms({ q: "" }))
      .map(buildImageMapper({ lang: params.lang }));

    return ctx.render({
      title,
      base,
      images,
      lang,
      href: collectionHref("image"),
    });
  },
};

export default function ImagesPage(
  { data: { title, lang, base, images, href } }: PageProps<
    ImagesProps
  >,
) {
  return (
    <Page
      title={title}
      href={href}
      base={base}
      lang={lang}
      collection="home"
    >
      <div id="gallery" class="hub">
        {images.map(({ src, id, href }, i) => (
          <AImg id={id} src={src} n={1 + i} href={href} />
        ))}
      </div>

      <Head>
        <link rel="stylesheet" href={asset("/css/gallery.css")} />
      </Head>
    </Page>
  );
}
// Future?
// https://www.smashingmagazine.com/native-css-masonry-layout-css-grid/
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Masonry_layout
