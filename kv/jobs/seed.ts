import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { seedDois } from "./seed/seed_dois.ts";
import { seedAkvaplanists } from "./seed/seed_akvaplanists.ts";
import { seedCustomerServices } from "./seed/seed_customer_services.ts";
import { seedMynewsdesk } from "./seed/seed_mynewsdesk.ts";

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

export const seedKv = async () => {
  await seedHomeBanner();
  //seedArcticFrontiers();
  seedAkvaplanists();
  seedCustomerServices();
  //seedReserchTopics();
  seedMynewsdesk();
  seedDois();
};
