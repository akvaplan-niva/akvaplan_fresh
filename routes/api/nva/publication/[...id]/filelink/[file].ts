import { FreshContext, Handlers } from "$fresh/server.ts";
import { NVA_API } from "akvaplan_fresh/services/nva.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext) {
    const { id, file } = ctx.params;
    const path = `/publication/${id}/filelink/${file}`;
    const url = new URL(path, NVA_API);
    return await fetch(url);
  },
};
