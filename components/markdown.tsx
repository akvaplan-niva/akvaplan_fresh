import { render } from "jsr:@deno/gfm@0.6";
export const Markdown = ({ text, ...props }) => {
  const __html = render(text, {
    //baseUrl: "https://example.com",
  });

  return (
    <article class="markdown">
      <div
        style={{ margin: "0 auto", fontFamily: "inherit" }}
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
        {...props}
        dangerouslySetInnerHTML={{
          __html,
        }}
      />
    </article>
  );
};
