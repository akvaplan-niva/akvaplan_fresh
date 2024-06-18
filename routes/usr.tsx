import { paramsForAuthoredPubs, search } from "akvaplan_fresh/search/search.ts";

import _cristin_ids from "akvaplan_fresh/data/cristin_ids.json" with {
  type: "json",
};

const crid = new Map<string, number>(_cristin_ids as [[string, number]]);

import { buildAkvaplanistMap } from "akvaplan_fresh/services/akvaplanist.ts";
import { priorAkvaplanistID as priors } from "akvaplan_fresh/services/prior_akvaplanists.ts";

import {
  Card,
  Page,
  PeopleCard as PersonCard,
} from "akvaplan_fresh/components/mod.ts";

import {
  extractLangFromUrl,
  lang as langSignal,
  t,
} from "akvaplan_fresh/text/mod.ts";

import GroupedSearch from "akvaplan_fresh/islands/grouped_search.tsx";

import { getValue } from "akvaplan_fresh/kv/mod.ts";
import { getWorks } from "akvaplan_fresh/services/cristin.ts";
import {
  CristinWorksGrouped,
  groupByCategory,
} from "../components/cristin_works_grouped.tsx";

import type { Akvaplanist } from "akvaplan_fresh/@interfaces/mod.ts";

import {
  base64DataUri,
  buildMicrosoftOauthHelpers,
} from "akvaplan_fresh/oauth/microsoft_helpers.ts";

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
  routeOverride: "/:at(@|~):id([a-zA-Z]{3}){/:name}*",
};

const ids = await buildAkvaplanistMap();
export const handler: Handlers = {
  async GET(req: Request, ctx: FreshContext) {
    const { at, id, name } = ctx.params;
    const { searchParams } = new URL(req.url);
    const { url } = ctx;
    const lang = at === "~" ? "no" : "en";
    langSignal.value = lang;

    const akvaplanist = ids.get(id) ?? priors.get(id);
    // @todop Consider falling back to orama ?
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

    const config =
      await getValue<typeof defaultAtConfig>(["@", "config", id]) ??
        defaultAtConfig;

    const params = paramsForAuthoredPubs(akvaplanist);

    const results = config.search.enabled === false
      ? undefined
      : await search(params);

    const orama = { results, params };

    const cristin: { works?: any[]; id?: number } = {
      id: crid.has(id) ? crid.get(id) as number : undefined,
    };

    if (config.cristin.enabled || searchParams.has("cristin")) {
      const _works = await getWorks(cristin.id);
      const { rejectCategories } = {
        ...defaultAtConfig.cristin,
        ...config.cristin,
      };
      const works = _works
        ?.filter(({ category: { code } }) =>
          false === rejectCategories.includes(code)
        );
      if (works?.length > 0) {
        cristin.works = works;
      }
    }

    return ctx.render({
      akvaplanist,
      at,
      url,
      config,
      cristin,
      orama,
      user,
      avatar,
    });
  },
};

export default function UsrPage({ data }: PageProps<AtHome>) {
  const { akvaplanist, at, url, config, cristin, orama, user, avatar } = data;
  const { given, family, prior, expired, openalex, orcid } = akvaplanist;
  const name = `${given} ${family}`;
  const bio = akvaplanist?.bio;
  const lang = extractLangFromUrl(url);
  const externalIdentities = buildPersonalSocialMediaLinks(akvaplanist);

  return (
    <Page base={`/${at}${akvaplanist.id}`} title={name}>
      <PersonCard
        person={akvaplanist}
        lang={lang}
        avatar={avatar && user && user.email.startsWith(akvaplanist.id)
          ? base64DataUri(avatar)
          : undefined}
      />

      {akvaplanist && !(prior || expired) && (
        <p style={{ fontSize: "0.8rem" }}>
          {user?.email?.startsWith(akvaplanist.id)
            ? (
              <a href="/auth/sign-out">
                Sign out
              </a>
            )
            : (
              <a href="/auth/sign-in">
                Sign in
              </a>
            )}
        </p>
      )}

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

      {config.search.enabled !== false && (
        <GroupedSearch
          term={orama.params.term}
          results={orama.results}
          exclude={config.search.exclude ?? ["person"]}
          sort={"-published"}
          origin={url}
          noInput
        />
      )}

      {cristin.id && !cristin.works && (
        <p style={{ fontSize: "0.8rem" }}>
          <a href={`?cristin`}>
            {t("cristin.Show_works_from_Cristin")}
          </a>
        </p>
      )}

      {cristin.id && cristin.works && (
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
                    Cristin
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
          <aside id="cristin">
            <CristinWorksGrouped
              grouped={Map.groupBy(cristin.works, groupByCategory)}
              lang={lang}
            />
          </aside>
        </>
      )}
    </Page>
  );
}
