import { Head } from "$fresh/runtime.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

let defaultStyles = [];

if (!IS_BROWSER) {
  const button = Deno.readTextFile(`./components/button/button.css`);
  const hscroll = Deno.readTextFile(`./components/album/halbum.css`);

  const cssfiles = [
    "reset",
    "fonts",
    "openprops",
    "root",
    "dark",
    "light",
  ].map((f) => Deno.readTextFile(`./static/css/${f}.css`));
  defaultStyles = await Promise.all([...cssfiles, button, hscroll]);
}

export const Styles = ({ styles = IS_BROWSER ? [] : defaultStyles } = {}) => (
  <style dangerouslySetInnerHTML={{ __html: styles.join("\n") }} />
);
//console.log("@todo add deno task to compile styles per route");
