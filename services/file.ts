export const readJsonFile = async <T>(
  path: URL,
) => {
  try {
    const stat = await Deno.stat(path);
    if (stat.isFile) {
      return JSON.parse(await Deno.readTextFile(path)) as T;
    }
  } catch (e) {
    console.error(`Could not find/open/parse ${path}`, e);
  }
  return [] as T;
};

export const saveJson = async (path: string | URL, ob: unknown) =>
  await Deno.writeTextFile(path, JSON.stringify(ob));
