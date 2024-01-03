import { seedMynewsdesk } from "./seed_mynewsdesk.ts";

export const seed = async () => {
  await seedMynewsdesk();
};

Deno.cron("sync external data to kv", "*/10 * * * *", () => seed());
