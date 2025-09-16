import {
  oramaSearchParamsForAuthoredPubs,
  search,
} from "akvaplan_fresh/search/search.ts";
import { getWorksBy } from "akvaplan_fresh/services/pub.ts";
import { worksByUrl } from "akvaplan_fresh/services/nav.ts";
import { peopleURL } from "akvaplan_fresh/services/mod.ts";
import { getAvatarImageBytes, getSession } from "akvaplan_fresh/kv/session.ts";

import { withYearAndLinkableSlug } from "./by.tsx";
import { getAkvaplanist } from "akvaplan_fresh/services/akvaplanist.ts";

import {
  extractLangFromUrl,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import {
  buildMicrosoftOauthHelpers,
} from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { base64DataUri } from "akvaplan_fresh/img/data_uri.ts";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";
import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";

import {
  buildPersonalSocialMediaLinks,
  SocialMediaIcons,
} from "akvaplan_fresh/components/social_media_icons.tsx";
import { mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";

import { GroupedWorks } from "akvaplan_fresh/islands/works.tsx";
import { Section } from "akvaplan_fresh/components/section.tsx";
import {
  Breadcrumbs,
  Card,
  Page,
  PersonCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

interface AtHome {
  akvaplanist: Akvaplanist;
}

export const config: RouteConfig = {
  //@... => "en" ("at")
  //~... => "no" ("hjem")
  routeOverride: "/:at(@|~|en/user/|no/bruker/):id([a-z0-9]{3,}){/:name}*",
};

export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id, name } = ctx.params;
    const { url } = ctx;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang; //Sometimes needed

    const akvaplanist = await getAkvaplanist(id);
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }

    akvaplanist.bio = ``;
    //const { given, family } = akvaplanist;

    const { getSessionId } = buildMicrosoftOauthHelpers(req);
    const session = await getSessionId(req);

    const user = session ? await getSession(session) : null;
    const avatar = user?.email ? await getAvatarImageBytes(user?.email) : null;

    const params = oramaSearchParamsForAuthoredPubs(akvaplanist);

    const results = await search(params);

    const orama = { results, params };

    const editor = await mayEditKvPanel(req);

    const works = akvaplanist?.id ? await getWorksBy(akvaplanist.id) : [];

    const grouped = Map.groupBy(
      works ? withYearAndLinkableSlug(works) : [],
      (w) => w?.type,
    );

    return ctx.render({
      akvaplanist,
      at,
      url,
      orama,
      user,
      avatar,
      editor,
      works,
      grouped,
    });
  },
};

export default function UsrPage({ data }: PageProps<AtHome>) {
  const {
    akvaplanist,
    at,
    url,

    orama,
    user,
    avatar,
    editor,
    grouped,
    works,
  } = data;
  const { given, family, prior, expired, openalex, orcid } = akvaplanist;
  const name = `${given} ${family}`;
  const bio = akvaplanist?.bio;
  const lang = extractLangFromUrl(url);
  const externalIdentities = buildPersonalSocialMediaLinks(akvaplanist);
  const breadcrumbs = [{
    href: peopleURL({ lang }),
    text: t(`nav.People`),
  }];

  const years = [null, ...new Set(works?.map((p) => +p.year))].sort().reverse();

  return (
    <Page base={`/${at}${akvaplanist.id}`} title={name}>
      <Breadcrumbs list={breadcrumbs} />
      <PersonCard
        href={works?.length > 0 ? worksByUrl(akvaplanist.id, lang) : "#"}
        person={akvaplanist}
        lang={lang}
        avatar={avatar && user && user.email.startsWith(akvaplanist.id)
          ? base64DataUri(avatar)
          : undefined}
      />

      <ul style={{ fontSize: "0.8rem" }}>
        {akvaplanist && !(prior || expired) && (
          <>
            <li>
              {
                user?.email?.startsWith(akvaplanist.id)
                  ? (
                    <LinkIcon
                      icon="exit_to_app"
                      href="/auth/sign-out"
                      children="Sign out"
                    />
                  )
                  : <></>
                // <LinkIcon
                //   icon="edit"
                //   href="/auth/sign-in"
                //   children="Sign in"
                // />
              }
            </li>
          </>
        )}
      </ul>

      <div class="footer__links">
        <SocialMediaIcons
          lang={lang.value}
          list={externalIdentities}
          //filter={""}
        />
      </div>

      {bio && (
        <Card>
          <div dangerouslySetInnerHTML={{ __html: bio }} />
        </Card>
      )}

      <GroupedSearch
        term={orama.params.term}
        results={orama.results}
        exclude={["person", true || works?.length === 0 ? "pubs" : undefined]}
        sort={"-published"}
        origin={url}
        noInput
      />

      <Section>
        {/* <h2>{t("nav.Pubs")} ({works?.length})</h2> */}
        {/* <a href="?group-by=year">year</a> */}
        <GroupedWorks
          works={works}
          groupedBy={"type"}
          years={years}
          //limit={3}
          lang={lang}
        />
      </Section>
    </Page>
  );
}
