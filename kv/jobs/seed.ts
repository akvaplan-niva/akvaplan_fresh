import { seedAkvaplanists } from "./akvaplanists/seed_akvaplanists.ts";
import { seedMynewsdesk } from "./seed_mynewsdesk.ts";

export const seedKv = async () => {
  await seedAkvaplanists();
  await seedMynewsdesk();
};

if (import.meta.main) {
  await seedKv();
}
