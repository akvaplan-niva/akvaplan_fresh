import { openKv } from "akvaplan_fresh/kv/mod.ts";

const fetchServices = async () => await fetch("https://svc.deno.dev/");
interface CustomerService {
  level: number;
}

const levelFilter = (n: number = 0) => ({ level }: CustomerService) =>
  level === n;

export const getServicesFromDenoService = async () => {
  const r = await fetchServices();
  if (r.ok) {
    return await r.json();
  }
};
export const seedCustomerServices = async () => {
  const kv = await openKv();
  const existing = await getExistingIds();
  const services0 = (await getServicesFromDenoService()).filter(levelFilter(0));

  services0.map(async (svc) => {
    const { id } = svc;
    const key = ["customer_service", 0, id];
    console.warn(svc);
    //await kv.set(key, person);
  });
};
