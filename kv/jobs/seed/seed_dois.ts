import { openKv } from "@/kv/mod.ts";
import { getDoisFromDenoDeployService } from "@/services/dois.ts";
import type { SlimPublication } from "@/@interfaces/slim_publication.ts";

export const seedDois = async () => {
  const kv = await openKv();
  const { data } = await getDoisFromDenoDeployService();
  data.map(async (value: SlimPublication) => {
    const [prefix, ...suffix] = value.doi.split("/");
    const key = ["dois", prefix, ...suffix];
    console.warn(key);
    await kv.set(key, value);
  });
};
