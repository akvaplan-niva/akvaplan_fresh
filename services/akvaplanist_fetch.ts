import type { Akvaplanist } from "@/@interfaces/akvaplanist.ts";

export const validAkvaplanistType = (type: string) =>
  ["", "all", "prior", "fresh"].includes(type);

// Shared by the browser and server, without importing the service barrel or
// running network requests at module initialization.
export async function fetchAkvaplanistEntries(type = "") {
  if (!validAkvaplanistType(type)) {
    throw new RangeError(`Invalid Akvaplanist type: ${type}`);
  }
  const url = typeof document === "undefined"
    ? new URL(
      `/${type}`,
      Deno.env.get("AKVAPLANISTS") || "https://akvaplanists.apn.deno.net",
    )
    : new URL(`/api/akvaplanists?type=${type}`, document.baseURI);
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Akvaplanists service returned HTTP ${response.status}`);
  }
  const entries: { value: Akvaplanist }[] = await response.json();
  if (!Array.isArray(entries) || entries.some((entry) => !entry?.value)) {
    throw new TypeError("Invalid Akvaplanists response");
  }
  return entries;
}
