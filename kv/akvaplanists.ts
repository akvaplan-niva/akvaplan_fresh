// import { getValue, openKv } from "./mod.ts";
// import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

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
