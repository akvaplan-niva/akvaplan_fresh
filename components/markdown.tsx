import { render } from "jsr:@deno/gfm@0.8.2";
export const Markdown = ({ text, renderOptions, ...props }) => {
  const __html = render(text, renderOptions);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: "",
        }}
      />
      <div
        class="markdown markdown-body"
        {...props}
        style={{ margin: "0 auto", fontFamily: "inherit" }}
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        {...props}
        dangerouslySetInnerHTML={{
          __html,
        }}
      />
    </>
  );
};
