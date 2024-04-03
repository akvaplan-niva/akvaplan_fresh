import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/mod.ts";
import { ImageArticle } from "akvaplan_fresh/components/image_article.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { search } from "akvaplan_fresh/search/search.ts";
import { LinkBackToCollection } from "akvaplan_fresh/components/link_back_to_collection.tsx";
import { AtomCard } from "../components/atom_card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { getItem } from "akvaplan_fresh/services/mynewsdesk.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
//import { searchOrama } from "akvaplan_fresh/routes/api/search.ts";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(image|bilde){/:date}?/:slug",
};

const searchImageUsed = async (image) => {
  const term = extractId(image.image);
  console.warn({ term });
  const collection = ["news", "blog", "pressrelease", "project"];
  const params = { term, where: { collection } };
  return await search(params);
};

export default async function ImagePage(req: Request, ctx: RouteContext) {
  const { slug, lang } = ctx.params;
  const id = extractId(slug);
  const image = await getItem(Number(id), "image");
  if (!image) {
    return ctx.renderNotFound();
  }
  const { hits } = await searchImageUsed(image);
  const rel = hits?.map((h) => h.document);

  return (
    <Page title={t("nav.Images")} collection="images">
      <ImageArticle image={image} />
      <section class="Section block-center-center">
        {rel?.length > 0 && (
          <div class="Container content-3">
            <header class="block">
              <h2>Brukt i</h2>
            </header>
            <div class="BentoGrid block gap-3">
              {rel?.map((atom) => (
                <AtomCard
                  atom={atom}
                  hero={true}
                  width={256}
                  reveal={true}
                />
              ))}
            </div>
          </div>
        )}
      </section>
      <LinkBackToCollection collection={"images"} lang={lang} />
      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </Page>
  );
}
