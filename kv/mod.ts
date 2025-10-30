// FIXME Export from KV to JSON on dev start?
export const db = globalThis?.Deno && Deno.env.has("deno_kv_database")
  ? Deno.env.get("deno_kv_database")
  : undefined;

let _kv: undefined | Deno.Kv;

// $ ./bin/kv_list '[]' | nd-uniq 'd.key.at(0)'
// "@"
// "avatar"
// "mynewsdesk_cloudinary"
// "mynewsdesk_id"
// "mynewsdesk_slug"
// "mynewsdesk_total"
// "mynewsdesk_video_embed"
// "mynewsdesk_video_id"
// "oauth_sessions"
// "panel"
// "rights"
// "session_user"
// "site_sessions"

export const openKv = async (path = db) => {
  if (!_kv) {
    if (path) {
      console.warn("Opening KV", db);
    }
    _kv = await Deno.openKv(path);
  }
  return _kv;
};
export async function getValue<T>(
  key: Deno.KvKey,
  options = undefined,
) {
  const kv = await openKv();
  const { value, versionstamp } = await kv.get<T>(key, options);
  return versionstamp ? value : undefined;
}
