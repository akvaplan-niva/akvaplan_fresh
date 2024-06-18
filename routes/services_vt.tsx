import { getServicesLevel0FromExternalDenoService } from "akvaplan_fresh/services/svc.ts";
import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import {
  ArticleSquare,
  Card,
  HScroll,
  Page,
  PeopleCard,
} from "akvaplan_fresh/components/mod.ts";

import HScrollWithDynamicImage from "akvaplan_fresh/islands/HScrollWithDynamicImage.tsx";
import { OurServices } from "../islands/our_x.tsx";

import { lang, t } from "akvaplan_fresh/text/mod.ts";

import {
  type FreshContext,
  type Handlers,
  type PageProps,
  type RouteConfig,
} from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
export const config: RouteConfig = {
  routeOverride: "/:lang(en|no)/:page(services3|tjenester3)",
};

const _section = {
  marginTop: "2rem",
  marginBottom: "3rem",
};
const _header = {
  marginBlockStart: "1rem",
  marginBlockEnd: "0.5rem",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { params } = ctx;
    const { searchParams } = new URL(req.url);
    lang.value = params.lang;

    const title = t("nav.Services");
    const base = `/${params.lang}/${params.page}/`;

    const { groupname, filter } = params;
    const group = groupname?.length > 0 ? groupname : "year";
    const q = searchParams.get("q") ?? "";

    const services = await getServicesLevel0FromExternalDenoService(
      params.lang,
    );

    const people = await buildAkvaplanistMap();
    const contacts = new Map([["lab", "mfr"]]);
    return ctx.render({ lang, title, base, services, people, contacts });
  },
};

const Div = (s) => {
  const id = s.img.split("/").at(-1);
  console.warn(s.img);
  return (
    <div class="Content">
      <input
        type="radio"
        id={id}
        name="gallery"
        value={id}
      />

      <label for={id}>{s.name}</label>

      <div
        class="Content block-center-start gap-1"
        style={{ background: "var(--surface0)" }}
      >
        <img
          alt=""
          loading="lazy"
          src={s.img ?? s.thumb}
        />
        <h3 class="backdrop-blur" style={{ color: "var(--link)" }}>
          {s.title}
        </h3>
        <small>{s.name}</small>
      </div>
    </div>
  );
};

export default function Services(
  { data: { lang, title, base, services, people, contacts } }: PageProps<
    unknown
  >,
) {
  const width = 512;
  const height = 512;
  return (
    <Page title={title} base={base}>
      <Head>
        <link rel="stylesheet" href={asset("/css/hscroll.css")} />
        <link rel="stylesheet" href={asset("/css/article.css")} />
        <link rel="stylesheet" href={asset("/css/bento.css")} />
        <link rel="stylesheet" href={asset("/css/gallery-vt.css")} />
        <script type="module" src={asset("/css/gallery.js")} />
      </Head>

      <main>
        <fieldset id="gallery" class="hub">
          {services.map(Div)}
        </fieldset>
      </main>
    </Page>
  );
}
