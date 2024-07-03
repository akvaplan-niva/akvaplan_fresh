import { getValue, openKv } from "./mod.ts";
import type { Akvaplanist as T } from "akvaplan_fresh/@interfaces/akvaplanist.ts";

export async function* customerServicesGenerator() {
  const kv = await openKv();
  for await (
    const { value } of kv.list<T>({ prefix: ["customer_services"] })
  ) {
    yield value;
  }
}
export const getCustomerService = async (
  id: string,
): Promise<T | undefined> => await getValue(["customer_services", id]);

export const findCustomerServiceByTopic = async (
  topic: string,
): Promise<T | undefined> => {
  let service;
  for await (const s of customerServicesGenerator()) {
    if (
      topic === s.topic || topic === s.tema || JSON.stringify(s).includes(topic)
    ) {
      service = s;
      break;
    }
  }
  return service;
};
