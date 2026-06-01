import {
  defineConfig,
  InnerRenderFunction,
  RenderContext,
  RenderFunction,
} from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { extractLangFromUrl } from "./text/mod.ts";

const render: RenderFunction = (
  ctx: RenderContext,
  freshRender: InnerRenderFunction,
) => {
  // Set `lang` in render context -> reflects into html[lang]
  const lang = extractLangFromUrl(ctx.url);
  if (lang) {
    ctx.lang = lang;
  }
  freshRender();
};

export default defineConfig({
  render,
  plugins: [tailwind()],
  port: 7777,
});
