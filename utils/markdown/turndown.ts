import Turndown from "turndown";

export const markdownFromHtml = (
  body: string,
  frontmatter: Record<string, unknown> = {},
) => {
  const fm = `---
${JSON.stringify(frontmatter)}
---`;
  const td = new Turndown();
  return `${fm}\n\n` + td.turndown(body, { linkStyle: "referenced" });
};
