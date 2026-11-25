import type { Handlers } from "$fresh/server.ts";
import {
  fetchAkvaplanistEntries,
  validAkvaplanistType,
} from "@/services/akvaplanist_fetch.ts";

export const handler: Handlers = {
  async GET(req) {
    const type = new URL(req.url).searchParams.get("type") ?? "";
    if (!validAkvaplanistType(type)) {
      return Response.json({ error: "Invalid Akvaplanist type" }, {
        status: 400,
      });
    }
    try {
      return Response.json(await fetchAkvaplanistEntries(type));
    } catch (error) {
      console.error("Akvaplanists upstream request failed", { type, error });
      return Response.json(
        { error: "Employee directory is temporarily unavailable" },
        { status: 502 },
      );
    }
  },
};
