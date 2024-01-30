import { openKv } from "akvaplan_fresh/kv/mod.ts";
import type { CustomerService } from "akvaplan_fresh/@interfaces/customer_service.ts";
const fetchServices = async () => await fetch("https://svc.deno.dev/");

const levelFilter = (n = 0) => ({ level }: CustomerService) => level === n;

export const getServicesFromDenoService = async () => {
  const r = await fetchServices();
  if (r.ok) {
    return await r.json();
  }
};
export const seedCustomerServices = async () => {
  const kv = await openKv();
  const level = 0;
  const services0 = (await getServicesFromDenoService()).filter(
    levelFilter(level),
  );

  services0.map(async (svc: CustomerService) => {
    const { uuid } = svc;
    const key = ["customer_services", uuid];
    await kv.set(key, svc);
  });
};
