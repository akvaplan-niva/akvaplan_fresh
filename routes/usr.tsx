import {
  oramaSearchParamsForAuthoredPubs,
  search,
} from "akvaplan_fresh/search/search.ts";

import _cristin_ids from "akvaplan_fresh/data/cristin_ids.json" with {
  type: "json",
};

const crid = new Map<string, number>(_cristin_ids as [[string, number]]);

import {
  buildAkvaplanistMap,
  getAkvaplanist,
  getPriorAkvaplanistFromDenoService,
} from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID as priors } from "akvaplan_fresh/services/prior_akvaplanists.ts";

import {
  Card,
  Icon,
  Page,
  PersonCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import { extractLangFromUrl, t } from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getWorks } from "akvaplan_fresh/services/cristin.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "../components/cristin_works_grouped.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import {
  buildMicrosoftOauthHelpers,
} from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { base64DataUri } from "akvaplan_fresh/img/data_uri.ts";

import type {
  FreshContext,
  Handlers,
  PageProps,
  RouteConfig,
} from "$fresh/server.ts";
import { getAvatarImageBytes, getSession } from "akvaplan_fresh/kv/session.ts";
import {
  buildPersonalSocialMediaLinks,
  SocialMediaIcons,
} from "akvaplan_fresh/components/social_media_icons.tsx";
import { mayEditKvPanel } from "akvaplan_fresh/kv/panel.ts";
import { LinkIcon } from "akvaplan_fresh/components/icon_link.tsx";
import { getWorksBy } from "akvaplan_fresh/services/pub.ts";
import { worksByUrl } from "akvaplan_fresh/services/nav.ts";

const defaultAtConfig = {
  search: {
    enabled: true,
  },
  cristin: {
    id: -Infinity,
    enabled: false,
    rejectCategories: [
      "ACADEMICLECTURE",
      "ARTICLEPOPULAR",
      "DOCUMENTARY",
      "LECTURE",
      "LECTUREPOPULAR",
      "MEDIAINTERVIEW",
      "POPULARARTICLE",
      "POSTER",
    ],
  },
};

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
    //langSignal.value = lang;

    const cand = await getAkvaplanist(id);
    const akvaplanist = cand ?? await getPriorAkvaplanistFromDenoService(id);

    // @todo Consider falling back to orama ?
    if (!akvaplanist) {
      return ctx.renderNotFound();
    }
    if (!name) {
      // const headers = { location: akvaplanistUrl(akvaplanist, lang) };
      // return new Response("", { status: 301, headers });
    }
    akvaplanist.bio = ``;
    //const { given, family } = akvaplanist;

    const { getSessionId } = buildMicrosoftOauthHelpers(req);
    const session = await getSessionId(req);

    const user = session ? await getSession(session) : null;
    const avatar = user?.email ? await getAvatarImageBytes(user?.email) : null;

    const config = defaultAtConfig;

    const params = oramaSearchParamsForAuthoredPubs(akvaplanist);

    const results = await search(params);

    const orama = { results, params };

    const editor = await mayEditKvPanel(req);

    const works = akvaplanist?.id ? await getWorksBy(akvaplanist.id) : [];

    return ctx.render({
      akvaplanist,
      at,
      url,
      config,
      orama,
      user,
      avatar,
      editor,
      works,
    });
  },
};

export default function UsrPage({ data }: PageProps<AtHome>) {
  const {
    akvaplanist,
    at,
    url,
    config,
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

  return (
    <Page base={`/${at}${akvaplanist.id}`} title={name}>
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
          filter={""}
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
        exclude={["person", works?.length === 0 ? "pubs" : undefined]}
        sort={"-published"}
        origin={url}
        noInput
      />

      {false && (
        <>
          <header
            style={{ paddingBlockStart: "1rem", paddingBlockEnd: "0.5rem" }}
          >
            <h2>{t("cristin.Works")}</h2>
            <details style={{ fontSize: "0.75rem" }}>
              <summary>
                <cite>
                  {t("ui.Data_from")}{" "}
                  <a
                    target="_blank"
                    sessionId
                    href={`https://app.cristin.no/search.jsf?t=${""}&type=result&filter=person_idfacet~${cristin.id}`}
                  >
                    {t("NVA")}
                  </a>
                </cite>
              </summary>

              {config.cristin.enabled !== true && (
                <span>
                  <a href="">{t("ui.Hide")}</a>
                </span>
              )}
            </details>
          </header>
        </>
      )}
    </Page>
  );
}
