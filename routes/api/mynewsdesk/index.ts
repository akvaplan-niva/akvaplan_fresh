import { openKv } from "@/kv/mod.ts";
import { Handlers } from "$fresh/src/server/types.ts";

type Count = Record<string, number>;

const total = async (kv: Deno.Kv) => {
  const { value } = await kv.get(["mynewsdesk_total"]) as {
    value: { count: Count; actual: Count };
  };
  const errors = await Array.fromAsync(
    await kv.list({ prefix: ["mynewsdesk_error"] }),
  );
  return { ...value, errors };
};

export const handler: Handlers = {
  async GET() {
    return Response.json(await total(await openKv()));
  },
};
