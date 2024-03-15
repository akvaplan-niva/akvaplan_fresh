import { IS_BROWSER } from "$fresh/runtime.ts";

let defaultStyles: string[] = [];

if (!IS_BROWSER) {
  const button = Deno.readTextFile(`./components/button/button.css`);
  const hscroll = Deno.readTextFile(`./components/album/halbum.css`);
  const inputSearch = Deno.readTextFile(`./components/search/input-search.css`);

  const cssfiles = [
    "reset",
    "fonts",
    "openprops",
    "root",
    "dark",
    "light",
    "bento",
  ].map(
    (f) => Deno.readTextFile(`./static/css/${f}.css`),
  );
  defaultStyles = await Promise.all([
    ...cssfiles,
    button,
    hscroll,
    inputSearch,
  ]);
}

export const Styles = ({ styles = defaultStyles } = {}) => (
  <style dangerouslySetInnerHTML={{ __html: styles.join("\n") }} />
);
