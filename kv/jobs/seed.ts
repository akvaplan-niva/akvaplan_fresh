import { seedMynewsdesk } from "./seed_mynewsdesk.ts";

export const seedKv = async () => {
  //seedAkvaplanists();
  await seedMynewsdesk();
};

if (import.meta.main) {
  await seedKv();
}
