import { FreshContext, Handlers } from "$fresh/server.ts";
import { listProjects } from "@/kv/project.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    return Response.json(Array.fromAsync(listProjects()));
  },
};
