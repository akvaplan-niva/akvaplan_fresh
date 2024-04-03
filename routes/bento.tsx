import { search } from "akvaplan_fresh/search/search.ts";
import { AlbumHeader } from "akvaplan_fresh/components/mod.ts";
import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { intlRouteMap } from "akvaplan_fresh/services/nav.ts";
import { t } from "akvaplan_fresh/text/mod.ts";
import { AtomCard } from "../components/atom_card.tsx";
import { asset, Head } from "$fresh/runtime.ts";
import { OurPeople } from "akvaplan_fresh/components/our_people.tsx";

export const config: RouteConfig = {
  //csp: true,
  //routeOverride: "/:lang(en|no)/kv/edit/:_prefix*",
};

const img = (cloudinary: string, w = 512, h = w) =>
  `https://resources.mynewsdesk.com/image/upload/c_fill,dpr_auto,f_auto,g_auto,w_${w},h_${h},q_auto:good/${cloudinary}`;

export default async function BentoGridPage(req: Request, ctx: RouteContext) {
  const lang = "no";
  const { hits, count } = await search({
    term: "",
    limit: 6,
    where: { collection: "news" },
  });

  const news = hits.map(({ document }) => ({
    ...document,
    img: img(document.cloudinary, 1024),
    thumb: img(document.cloudinary, 512),
  }));

  return (
    <main>
      <section class="Section block-center-center">
        <div class="Container content-3">
          <header class="block">
            <h2>Siste nytt</h2>
          </header>
          <div class="BentoGrid block gap-3">
            {news.map((atom) => <AtomCard atom={atom} />)}
          </div>
        </div>
      </section>

      <section class="Section block-center-center">
        <div class="Container content-3">
          <header class="block">
            <h2>Våre folk</h2>
          </header>
          <OurPeople />
        </div>
      </section>

      <script type="module" src="/css/bento.js"></script>
      <Head>
        <link rel="stylesheet" href={asset("/css/bento.css")} />
      </Head>
    </main>
  );
}
