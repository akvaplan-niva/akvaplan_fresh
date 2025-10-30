import { getVideo } from "akvaplan_fresh/kv/video.ts";
import { extractId } from "../services/extract_id.ts";

import { Page } from "akvaplan_fresh/components/page.tsx";
//import { Screen9Video } from "../islands/screen9.tsx";

import type { RouteConfig, RouteContext } from "$fresh/src/server/types.ts";
import { Head } from "$fresh/runtime.ts";
import { VideoArticle } from "akvaplan_fresh/components/VideoArticle.tsx";

export const config: RouteConfig = {
  routeOverride: "/:lang(no|en)/:type(film|video){/:date}?/:slug",
};

import { isAuthenticated } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import {
  editOnMynewsdeskHref,
  fetchContacts,
} from "akvaplan_fresh/services/mynewsdesk.ts";
import { Section } from "akvaplan_fresh/components/section.tsx";
import { PersonCard as PersonCard } from "akvaplan_fresh/components/mod.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { t } from "akvaplan_fresh/text/mod.ts";

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
    <Page title={video.header} collection="videos">
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

      <VideoArticle item={video} editor={editor} />

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
    </Page>
  );
}
