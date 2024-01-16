export const response307 = (Location: string) =>
  new Response("", {
    status: 307,
    headers: { Location },
  });
export const response307XRobotsTagNoIndex = (
  location: string | URL,
  status = 307,
) =>
  new Response("", {
    status,
    headers: {
      location: String(location),
      "x-robots-tag": "noindex, nofollow, noarchive, nosnippet",
    },
  });
