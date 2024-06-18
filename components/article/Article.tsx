import { asset, Head } from "$fresh/runtime.ts";

export function Article({ language, children }: { language: string }) {
  return (
    <article class="article" lang={language}>
      <Head>
        <link rel="stylesheet" href={asset("/css/article.css")} />
      </Head>
      {children}
    </article>
  );
}
export default Article;
