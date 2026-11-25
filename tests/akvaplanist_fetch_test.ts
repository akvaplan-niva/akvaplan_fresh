import { assertEquals, assertRejects } from "@std/assert";
import { fetchAkvaplanistEntries } from "../services/akvaplanist_fetch.ts";
import { handler } from "../routes/api/akvaplanists.ts";
import type { FreshContext } from "$fresh/server.ts";

const entries = [{ value: { id: "abc", given: "A", family: "B" } }];
const get = (type = "") =>
  handler.GET!(
    new Request(`http://localhost/api/akvaplanists?type=${type}`),
    {} as FreshContext,
  ) as Promise<Response>;

Deno.test("browser uses the site's API for both startup requests", async () => {
  const originalFetch = globalThis.fetch;
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: { baseURI: "http://localhost:8000/en/people" },
  });
  try {
    for (const type of ["prior", ""]) {
      globalThis.fetch = (input) => {
        assertEquals(
          String(input),
          `http://localhost:8000/api/akvaplanists?type=${type}`,
        );
        return Promise.resolve(Response.json(entries));
      };
      assertEquals(await fetchAkvaplanistEntries(type), entries);
    }
  } finally {
    globalThis.fetch = originalFetch;
    Reflect.deleteProperty(globalThis, "document");
  }
});

Deno.test("API uses configured upstream and preserves entries", async () => {
  const originalFetch = globalThis.fetch;
  const originalBase = Deno.env.get("AKVAPLANISTS");
  Deno.env.set("AKVAPLANISTS", "https://directory.example");
  globalThis.fetch = (input) => {
    assertEquals(String(input), "https://directory.example/prior");
    return Promise.resolve(Response.json(entries));
  };
  try {
    const response = await get("prior");
    assertEquals(response.status, 200);
    assertEquals(await response.json(), entries);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalBase === undefined) Deno.env.delete("AKVAPLANISTS");
    else Deno.env.set("AKVAPLANISTS", originalBase);
  }
});

Deno.test("invalid type is rejected before fetching", async () => {
  assertEquals((await get("invalid")).status, 400);
  await assertRejects(() => fetchAkvaplanistEntries("invalid"), RangeError);
});

Deno.test("API reports network, HTTP and malformed-data failures as 502", async () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  console.error = () => {};
  try {
    for (
      const mock of [
        () => Promise.reject(new TypeError("Failed to fetch")),
        () => Promise.resolve(new Response("Unavailable", { status: 503 })),
        () => Promise.resolve(Response.json({ unexpected: true })),
        () => Promise.resolve(new Response("not json")),
      ]
    ) {
      globalThis.fetch = mock;
      assertEquals((await get()).status, 502);
    }
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});
