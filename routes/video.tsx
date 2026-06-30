import { getVideo } from "@/kv/video.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "@/components/page.tsx";
//import { Screen9Video } from "../islands/screen9.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { Head } from "$fresh/runtime.ts";
import { VideoArticle } from "@/components/VideoArticle.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

import { isAuthenticated } from "@/oauth/microsoft_helpers.ts";
import { editOnMynewsdeskHref, fetchContacts } from "@/services/mynewsdesk.ts";
import { Section } from "@/components/section.tsx";
import { PersonCard as PersonCard } from "@/components/mod.ts";
import { LinkIcon } from "@/components/icon_link.tsx";
import { lang, t } from "@/text/mod.ts";
import { Naked } from "@/components/naked.tsx";
import { MajorSection } from "@/components/major_section.tsx";
import { HeaderLogoStickyNav } from "@/components/header_logo_sticky_nav.tsx";

export default async function VideoPage(req: Request, ctx: RouteContext) {
  const { slug } = ctx.params;
  const id = extractId(slug);
  const video = await getVideo(Number(id));

  if (!video) {
    return ctx.renderNotFound();
  }

  const contacts = await fetchContacts(video);
  const editor = await isAuthenticated(req);

  return (
    <Naked title={video.header} collection="videos">
      <HeaderLogoStickyNav lang={lang} />
      {
        /* <Head>
        <script src="https://cdn.screen9.com/players/amber-player.js">
        </script>
        <link
          rel="stylesheet"
          href="https://cdn.screen9.com/players/amber-player.css"
        />
      </Head> */
      }

      {/* <img src={video.thumbnail} /> */}

      <MajorSection>
        <VideoArticle item={video} editor={editor} />
      </MajorSection>

      {
        /* <video
        id="video_HTML_container_ID"
        class="video-js vjs-fluid"
        controls
        playsinline
      >
      </video>
      <script type="module" src="/play.js"></script> */
      }
      <Section>
        <div style="display: grid; gap: 0.75rem; padding: .5rem; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)">
          {contacts.map((id) => <PersonCard id={id} icons={false} />)}
        </div>
      </Section>

      {editor && (
        <LinkIcon
          icon="edit"
          href={editOnMynewsdeskHref(video)}
          target="_blank"
          children={t("ui.Edit")}
        />
      )}
    </Naked>
  );
}
