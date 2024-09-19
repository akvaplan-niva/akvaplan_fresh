const base = "https://pubs.deno.dev/pub?limit=-1";
export const getPub = async (uri: string) => {
  const url = new URL(`/pub/${uri}`, base);
  console.warn(url.href);
  return await fetch(url);
};
