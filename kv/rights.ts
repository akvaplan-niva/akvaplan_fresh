import { openKv } from "akvaplan_fresh/kv/mod.ts";
interface Rights {
  actions: string;
}
export const hasRights = async (
  [system, resource, user, action]: string[] = [],
) => {
  const kv = await openKv();
  if (system && resource && user && action) {
    const rights = (await kv.get<Rights>(["rights", system, resource, user]))
      .value;
    if (rights) {
      return [...action].every((a) => rights.actions.includes(a));
    }
  }
  return await false;
};
