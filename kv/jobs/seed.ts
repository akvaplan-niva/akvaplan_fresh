import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { seedDois } from "./seed/seed_dois.ts";
import { seedAkvaplanists } from "./seed/seed_akvaplanists.ts";
import { seedCustomerServices } from "./seed/seed_customer_services.ts";
import { seedMynewsdesk } from "./seed/seed_mynewsdesk.ts";

// FIXME, Move search atomization, ie homogenize all content not while running, but at build time (or via cron)

const seedArcticFrontiers = async () => {
  const kv = await openKv();
  const af2024 = {
    text: "Arctic Frontiers 2024: Actions & Reactions",
    href: "https://arcticfrontiers.com",
  };
  const expireIn7d = {
    expireIn: 7 * 86400 * 1000,
  };
  await kv.set(["home", "announce", "en"], af2024, expireIn7d);
  await kv.set(["home", "announce", "no"], af2024, expireIn7d);
  // await kv.delete(["home", "announce", "en"]);
  // await kv.delete(["home", "announce", "no"]);
};

export const seedKv = async () => {
  seedArcticFrontiers();
  seedAkvaplanists();
  seedCustomerServices();
  //seedReserchTopics();
  seedMynewsdesk();
  seedDois();
};

if (import.meta.main) {
  await seedKv();
}
