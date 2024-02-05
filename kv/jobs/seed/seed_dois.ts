import { openKv } from "akvaplan_fresh/kv/mod.ts";
import { getDoisFromDenoDeployService } from "akvaplan_fresh/services/dois.ts";
import type { SlimPublication } from "akvaplan_fresh/@interfaces/slim_publication.ts";

export const seedDois = async () => {
  const kv = await openKv();
  const { data } = await getDoisFromDenoDeployService();
  data.map(async (value: SlimPublication) => {
    const [prefix, ...suffix] = value.doi.split("/");
    const key = ["dois", prefix, ...suffix];
    await kv.set(key, value);
  });
};
