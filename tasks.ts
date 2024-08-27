import {
  fetchIcon,
  icons as materialsymbols,
  processIcon,
  svgMapFromStaticDir,
} from "akvaplan_fresh/utils/materialsymbols/mod.ts";
import { getLatestAkvaplanWorks } from "akvaplan_fresh/services/cristin.ts";
import {
  extractNakedDoi,
  getDoisFromAkvaplanPubService,
} from "akvaplan_fresh/services/dois.ts";
import { ndjson } from "akvaplan_fresh/cli/ndjson.ts";

const iconDir = "static/icon";

const iconPath = (name: string) => `${iconDir}/${name}.svg`;

const fetchAndSaveMaterialSymbolIcons = async (list: Set<string>) => {
  for (const name of list) {
    const text = await fetchIcon(name);
    const path = iconPath(name);
    Deno.writeTextFile(path, processIcon(text, name));
    console.log({ path });
  }
};

// deno run --env --allow-env --allow-net=api.cristin.no,dois.deno.dev tasks.ts cristin
const cristinTask = async () => {
  const NO_DOI = "NO_DOI_IN_CRISTIN";

  const works = await getLatestAkvaplanWorks({ per_page: 9999 });
  const { data } = await getDoisFromAkvaplanPubService();
  const cristinWorksWithDoi = works?.map((w) => {
    const url = w?.links?.find(({ url }) =>
      url && url?.startsWith("https://doi.org/10.")
    );
    w.doi = url ? extractNakedDoi(url.url)?.toLowerCase() : NO_DOI;
    return w;
  });

  const cristinDois = new Set(cristinWorksWithDoi.map((w) => w?.doi));
  cristinDois.delete(NO_DOI);
  const cristinWorksByDoi = new Map(cristinWorksWithDoi.map((w) => [w.doi, w]));

  const akvaplanDois = new Set(data.map(({ doi }) => doi));

  const _onlyCristin = cristinDois.difference(akvaplanDois);
  //const onlyInAkvaplan = akvaplanDois.difference(cristinDois);

  const onlyCristin = [..._onlyCristin].map((doi) =>
    cristinWorksByDoi.get(doi)
  );
  console.warn(onlyCristin.length);
  onlyCristin.map(({ doi }) => ({ doi })).map(ndjson);
  //console.warn(onlyCristin);
};

const iconsTask = async (_args: string[] = []) => {
  await fetchAndSaveMaterialSymbolIcons(materialsymbols);

  const hamburger_menu_right = await Deno.readTextFile(
    new URL(import.meta.resolve("./static/icon/hamburger_menu_right.svg")),
  );
  const map = await svgMapFromStaticDir();
  map.set("hamburger_menu_right", hamburger_menu_right);
  // for (const name of materialsymbols) {
  //   const _svg = await Deno.readTextFile(
  //     new URL(import.meta.resolve(`./static/icon/${name}.svg`)),
  //   );
  //   const svg = processIcon(_svg, name);
  //   entries.push([name, svg]);
  // }
  Deno.writeTextFile("components/icons.json", JSON.stringify([...map]));
};

const tasks = new Map([
  ["icons", iconsTask],
  ["cristin", cristinTask],
]);

if (import.meta.main) {
  const [task] = Deno.args;
  if (tasks.has(task)) {
    await tasks.get(task)!(Deno.args.slice(1));
  }
}
