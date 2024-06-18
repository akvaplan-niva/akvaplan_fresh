// import { getValue, openKv } from "./mod.ts";
// import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

import { getSessionUser } from "akvaplan_fresh/oauth/microsoft_helpers.ts";
import { hasRights } from "akvaplan_fresh/kv/rights.ts";
import { akvaplan } from "akvaplan_fresh/services/akvaplanist.ts";
import { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

// const _map = new Map<string, Akvaplanist>();

// export async function* akvaplanistsKvGenerator() {
//   if (_map.size === 0) {
//     const kv = await openKv();
//     for await (
//       const { value } of kv.list<Akvaplanist>({ prefix: ["akvaplanists"] })
//     ) {
//       yield value;
//     }
//   }
// }

// export const akvaplanistMap = async () => {
//   if (_map.size === 0) {
//     for await (const p of akvaplanistsKvGenerator()) {
//       _map.set(p.id, p);
//     }
//   }
//   return _map;
// };

// export const getPerson = async (
//   id: string,
// ): Promise<Akvaplanist | undefined> => {
//   if (_map.has(id)) {
//     return _map.get(id);
//   }
//   return await getValue(["akvaplanists", id]);
// };

export const mayEdit = async (req: Request) => {
  const user = await getSessionUser(req);
  return user
    ? await hasRights(["kv", "akvaplanist", user.email, "cru"])
    : false;
};
