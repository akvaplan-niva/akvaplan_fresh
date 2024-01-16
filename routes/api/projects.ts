import { latestProjects } from "akvaplan_fresh/services/projects.ts";
import { FreshContext, Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext) {
    return Response.json(await latestProjects());
  },
};
