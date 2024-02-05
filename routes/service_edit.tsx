import { RouteConfig, RouteContext } from "$fresh/server.ts";
import { SELF, UNSAFE_INLINE, useCSP } from "$fresh/runtime.ts";
import { Article, Page } from "akvaplan_fresh/components/mod.ts";

// export default function Home(req: Request, ctx: RouteContext) {
//   useCSP((csp) => {
//     csp.directives.defaultSrc = [SELF];
//     csp.directives.scriptSrc = [SELF];
//     csp.directives.styleSrc = [SELF, UNSAFE_INLINE];
//   });
//   return (
//     <Page>
//       <Article>
//       </Article>
//     </Page>
//   );
// }

// export const config: RouteConfig = {
//   csp: true,
// };
