import { openKv } from "akvaplan_fresh/kv/mod.ts";
const kv = await openKv();

// FIXME, Move search atomization, ie homogenize all content *not* while running, but at build time (or via cron)

const seedArcticFrontiers = async () => {
  // const kv = await openKv();
  // const af2024 = {
  //   text: "Arctic Frontiers 2024: Actions & Reactions",
  //   href: "https://arcticfrontiers.com",
  // };
  // const expireIn5d = {
  //   expireIn: 5 * 86400 * 1000,
  // };
  // await kv.set(["home", "announce", "en"], af2024, expireIn5d);
  // await kv.set(["home", "announce", "no"], af2024, expireIn5d);
};

const seedHomeBanner = async () => {
  const kv = await openKv();
  const no = {
    text:
      "Vi er et uavhengig forskningsinstitutt med fokus på vann, hav og arktis",
    href: "/no/kv/edit/announce", // "/no/om",
  };
  const en = {
    text:
      "A not-for profit research institute focusing on water, ocean, and arctic issues",
    href: "/en/kv/edit/announce", // "/en/about",
  };

  await kv.set(["announce", "home", "no"], no);
  await kv.set(["announce", "home", "en"], en);
};

export const seedPanels = async () => {
  const atomic = kv.atomic();
  const panels = (await Deno.readTextFile("./data/seed/panels.ndjson"))
    .trim().split("\n").map((txt) => JSON.parse(txt));

  for await (const panel of panels) {
    const key = ["panel", panel.id];
    atomic
      //.check({ key, versionstamp: null })
      .set(key, panel);
  }
  const response = await atomic.commit();
  console.warn(response);
};
import _projects from "akvaplan_fresh/data/projects.json" with { type: "json" };
import {
  getItemFromMynewsdeskApi,
  intlRouteMap,
} from "akvaplan_fresh/services/mod.ts";
import { isodate } from "akvaplan_fresh/time/intl.ts";
import { MynewsdeskEvent } from "../../@interfaces/mynewsdesk.ts";
import { slug } from "slug";
import { projectLifecycle } from "../../search/indexers/project.ts";
import { update } from "@orama/orama";
import { Project } from "../../@interfaces/project.ts";

export const seedProjects = async () => {
  const atomic = kv.atomic();
  const people = new Set();
  const projects = _projects as Project[];

  for await (
    const {
      abbr,
      links,
      published,
      updated,
      ...project
    } of projects
  ) {
    //const ignore = { lifecycle, published, created, updated, links };
    project.published = new Date(published);
    project.updated = new Date(updated);
    const mynewsdesk = project.mynewsdesk
      ? await getItemFromMynewsdeskApi<MynewsdeskEvent>(
        project.mynewsdesk,
        "event",
      )
      : undefined;
    if (!mynewsdesk) {
      console.error(`Failed getting mynewsdesk event ${project.id}`);
    } else {
      const lang = new Set(["no", "en"]).has(mynewsdesk.language)
        ? mynewsdesk.language
        : "no";

      project.start = isodate(mynewsdesk.start_at.text);
      project.end = isodate(mynewsdesk.end_at.text);

      project.lifecycle = projectLifecycle(project);
      project.published = new Date(mynewsdesk?.published_at?.datetime!);
      project.updated = new Date(mynewsdesk?.updated_at?.datetime!);
      project.links = [...mynewsdesk?.links, ...links ?? []];

      project.abbr = abbr ? abbr : project.title.en;

      const summary = mynewsdesk.summary?.replaceAll(
        "https://www.mynewsdesk.com/no/akvaplan-niva/documents/",
        `${intlRouteMap(lang).get("document")}/`,
      ).replaceAll(
        ">https://www.mynewsdesk.com/no/...<",
        `>https://akvaplan.no/${lang}/…<`,
      ).replaceAll(
        `target="_blank"`,
        ` `,
      ).replaceAll(
        `rel="noopener"`,
        ` `,
      );

      // if ("no" in project.summary) {
      //   project.summary.no = markdownFromHtml(project.summary.no);
      // }

      project.summary = {
        [lang]: summary,
      };
    }
    project.slug = {
      en: slug(project.title.en, { locale: "en" }),
      no: slug(project.title.no, { locale: "no" }),
    };
    delete project.created;
    delete project.modified;
    const key = ["project", project.id];
    const maybe = await kv.get(key);
    if (!maybe.value) {
      console.warn("seed project start end", project.start, project.end);
      console.warn({ key, value: project });
      //atomic
      //.check({ key, versionstamp: null })
      //.set(key, project);
    }
  }

  const response = await atomic.commit();
  console.warn("seedProjects", response);
};

export const seedKv = async () => {
  //await seedHomeBanner();
  //seedArcticFrontiers();
  // await seedAkvaplanists();
  // await seedCustomerServices();
  // //seedReserchTopics();
  // await seedMynewsdesk();
  // seedDois();
  //await seedPanels(kv);
  //await seedPanels();
  await seedProjects();
};

if (import.meta.main) {
  await seedKv();
}
