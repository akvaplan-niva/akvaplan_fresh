import { getValue, openKv } from "./mod.ts";
import type { Akvaplanist } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

export async function* customerServices() {
  const kv = await openKv();
  for await (
    const { value } of kv.list<Akvaplanist>({ prefix: ["customer_services"] })
  ) {
    yield value;
  }
}

export const getCustomerService = async (
  id: string,
): Promise<Akvaplanist | undefined> =>
  await getValue(["customer_services", id]);
